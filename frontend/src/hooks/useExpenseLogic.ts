import { useState, useEffect, useMemo, type ChangeEvent, type FormEvent } from 'react';
import type { LucideIcon } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { CATEGORIES, CATEGORY_COLORS, OVERVIEW_ICONS } from '../components/dashboard/expenses/constants';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { checkingValidityCountOfNote, wordCounts } from '../components/dashboard/common/NotesMaxCount';
import { formatData } from '../components/utils/formatDate';
import type { Expense } from '../types';

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
  const [formData, setFormData] = useState<ExpenseFormData>(initialFormData);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState('All');
  const itemsPerPage = 5;

  const fetchExpenses = async () => {
    try {
      const data = await expenseService.getAll();
      const formatted = formatData(data);
      setExpenses(formatted);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filteredExpenses = useMemo(() => {
    const relevantExpenses =
      filterCategory === 'All' ? expenses : expenses.filter((exp) => exp.category === filterCategory);

    return [...relevantExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterCategory]);

  const overviewData = useMemo<OverviewCardData[]>(() => {
    const totalAllTime = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

    const categoryTotals: Record<string, number> = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
      return acc;
    }, {} as Record<string, number>);

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
  }, [expenses]);

  const categoryChartData = useMemo(() => {
    return filteredExpenses
      .reduce<Array<{ name: string; amount: number; fill: string }>>((acc, exp) => {
        const existing = acc.find((item) => item.name === exp.category);
        if (existing) {
          existing.amount += Number(exp.amount);
        } else {
          acc.push({
            name: exp.category,
            amount: Number(exp.amount),
            fill: CATEGORY_COLORS[exp.category],
          });
        }
        return acc;
      }, [])
      .filter((item) => item.amount > 0);
  }, [filteredExpenses]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);

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
    setSaving(true);
    setError(null);

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
      const newExpense = editId
        ? await expenseService.update(editId, payload)
        : await expenseService.create(payload);

      const data2 = editId
        ? expenses.map((o) => (o.id === editId ? newExpense : o))
        : [...expenses, newExpense];

      setExpenses(formatData(data2));
      fetchExpenses();
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editId ? 'update' : 'save'} expense.`);
    } finally {
      setSaving(false);
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
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense record?')) {
      try {
        await expenseService.remove(id);
        setExpenses((prev) => prev.filter((o) => o.id !== id));
      } catch (error) {
        console.error(error);
        setError('Error in deleting expense');
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    formData,
    wordCount,
    error,
    saving,
    expenses,
    loading,
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
    setFilterCategory,
  };
};
