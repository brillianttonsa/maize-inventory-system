import { useState, useMemo, type ChangeEvent, type FormEvent } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import type { LucideIcon } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { CATEGORIES, CATEGORY_COLORS, OVERVIEW_ICONS } from '../components/dashboard/expenses/constants';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { checkingValidityCountOfNote, wordCounts } from '../components/dashboard/common/NotesMaxCount';
import { formatData } from '../components/utils/formatDate';
import type { Expense } from '../types';
import type { ExpensePayload } from '../services/expenseService';
import { invalidateRecordQueries, queryKeys } from '../services/queryKeys';

interface ExpenseFormData {
  date: string;
  category: string;
  amount: string;
  unitValue: string;
  unitCost: string;
  sackSize: string;
  paidBy: string;
  method: string;
  notes: string;
}

const initialFormData: ExpenseFormData = {
  date: getTodayDate(),
  category: '',
  amount: '',
  unitValue: '',
  unitCost: '',
  sackSize: '',
  paidBy: '',
  method: '',
  notes: '',
};

const requiresUnitInput = (category: string): boolean => {
  const lowerCategory = category.toLowerCase();
  return (
    lowerCategory.includes('water') ||
    lowerCategory.includes('sacks') ||
    lowerCategory.includes('electricity')
  );
};

export interface OverviewCardData {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export const useExpensesLogic = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('All');
  const itemsPerPage = 5;

  const expensesQuery = useQuery({
    queryKey: queryKeys.expenses.list(currentPage, itemsPerPage, filterCategory),
    queryFn: () => expenseService.getPage(currentPage, itemsPerPage, filterCategory),
    placeholderData: keepPreviousData,
  });
  const summaryQuery = useQuery({
    queryKey: queryKeys.expenses.summary,
    queryFn: expenseService.getSummary,
  });
  const createMutation = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.expenses.all),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ExpensePayload> }) =>
      expenseService.update(id, payload),
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.expenses.all),
  });
  const deleteMutation = useMutation({
    mutationFn: expenseService.remove,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.expenses.all),
  });
  const expenses = formatData(expensesQuery.data?.items ?? []);
  const summary = summaryQuery.data ?? [];
  const loading = expensesQuery.isPending || summaryQuery.isPending;
  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const error =
    formError ??
    (expensesQuery.isError || summaryQuery.isError ? 'Failed to fetch expenses' : null);

  const overviewData = useMemo<OverviewCardData[]>(() => {
    const categoryTotals = Object.fromEntries(
      summary.map((item) => [item.category, Number(item.amount)]),
    ) as Record<string, number>;
    const totalAllTime = summary.reduce((sum, item) => sum + Number(item.amount), 0);

    const cards: OverviewCardData[] = CATEGORIES.map(({ name }) => ({
      title: name,
      value: categoryTotals[name] || 0,
      icon: OVERVIEW_ICONS[name] || OVERVIEW_ICONS.Wallet,
      color: name,
    }));

    cards.unshift({
      title: 'Total (All Time)',
      value: totalAllTime,
      icon: OVERVIEW_ICONS.Wallet,
      color: 'yellow',
    });

    return cards;
  }, [summary]);

  const categoryChartData = useMemo(() => {
    return summary
      .filter((item) => filterCategory === 'All' || item.category === filterCategory)
      .map((item) => ({
        name: item.category,
        amount: Number(item.amount),
        fill: CATEGORY_COLORS[item.category],
      }))
      .filter((item) => item.amount > 0);
  }, [summary, filterCategory]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormError(null);

    if (name === 'notes' && checkingValidityCountOfNote(name, value)) return;

    setFormData((prev) => {
      const newState = { ...prev, [name]: value };

      if (name === 'category' && !requiresUnitInput(value)) {
        newState.unitValue = '';
        newState.sackSize = '';
      }

      if (name !== 'unitValue' && !requiresUnitInput(newState.category)) {
        newState.unitValue = '';
        newState.sackSize = '';
      }

      return newState;
    });
  };

  const wordCount = wordCounts(formData);

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const { date, category, amount, unitValue, unitCost, sackSize, paidBy, method, notes } = formData;
    const calculatedAmount = ['sacks', 'water'].includes(category.toLowerCase())
      ? Number(unitValue) * Number(unitCost)
      : Number(amount);

    const payload = {
      date,
      category,
      amount: calculatedAmount,
      unit_value: Number(unitValue),
      ...(category.toLowerCase() === 'sacks' || category.toLowerCase() === 'water'
        ? { unit_cost: Number(unitCost) }
        : {}),
      ...(category.toLowerCase() === 'sacks' && { sack_size: Number(sackSize) as 5 | 10 | 25 }),
      paid_by: paidBy,
      method,
      notes,
    };

    try {
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      if (!editId && filterCategory === 'All') {
        const lastPage = Math.max(1, Math.ceil(((expensesQuery.data?.total ?? 0) + 1) / itemsPerPage));
        setCurrentPage(lastPage);
      }
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (err) {
      console.error(err);
      setFormError(`Failed to ${editId ? 'update' : 'save'} expense.`);
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData({
      date: expense.date,
      category: expense.category,
      amount: String(expense.amount),
      unitValue: expense.unit_value ? String(expense.unit_value) : '',
      unitCost: expense.unit_cost ? String(expense.unit_cost) : '',
      sackSize: expense.sack_size ? String(expense.sack_size) : '',
      paidBy: expense.paid_by || '',
      method: expense.method || '',
      notes: expense.notes || '',
    });
    setEditId(expense.id);
  };

  const handleCancelEdit = () => {
    resetForm({ initialFormData, setFormData, setEditId });
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense record?')) {
      try {
        await deleteMutation.mutateAsync(id);
        const nextTotal = Math.max(0, (expensesQuery.data?.total ?? 0) - 1);
        setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(nextTotal / itemsPerPage))));
      } catch (error) {
        console.error(error);
        setFormError('Error in deleting expense');
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = expenses;
  const totalPages = expensesQuery.data?.totalPages ?? 0;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    formData,
    wordCount,
    error,
    saving,
    expenses,
    loading,
    totalRecords: expensesQuery.data?.total ?? 0,
    currentPage,
    totalPages,
    currentExpenses,
    editId,
    filterCategory,
    indexOfFirst,
    overviewData,
    categoryChartData,
    paginate,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    setCurrentPage,
    setFilterCategory: (category: string) => {
      setFilterCategory(category);
      setCurrentPage(1);
    },
  };
};
