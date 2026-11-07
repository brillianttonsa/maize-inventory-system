import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTodayDate } from '../components/utils/todaydate';
import { operationalCostsService, type OperationalCost } from '../services/operationalCostsService';
import { queryKeys } from '../services/queryKeys';

interface OperationalCostForm {
  date: string;
  operation: string;
  startingUnits: string;
  remainingUnits: string;
  totalAmount: string;
  notes: string;
}

const emptyForm: OperationalCostForm = {
  date: getTodayDate(),
  operation: '',
  startingUnits: '',
  remainingUnits: '',
  totalAmount: '',
  notes: '',
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<{ message?: string | string[] }>(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(', ') : message ?? fallback;
}

export function useOperationalCostsLogic() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const recordsQuery = useQuery({
    queryKey: queryKeys.operationalCosts.all,
    queryFn: operationalCostsService.getAll,
  });
  const summaryQuery = useQuery({
    queryKey: queryKeys.operationalCosts.summary,
    queryFn: operationalCostsService.getSummary,
  });
  const summary = summaryQuery.data ?? {
    purchasedUnits: 0,
    usedUnits: 0,
    remainingUnits: 0,
    totalOperationalCost: 0,
  };
  const createMutation = useMutation({
    mutationFn: operationalCostsService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.operationalCosts.all }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof operationalCostsService.update>[1] }) =>
      operationalCostsService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.operationalCosts.all }),
  });
  const deleteMutation = useMutation({
    mutationFn: operationalCostsService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.operationalCosts.all }),
  });

  useEffect(() => {
    if (!editId && !formData.startingUnits && !summaryQuery.isPending) {
      const currentBalance = String(summary.remainingUnits);
      setFormData((previous) => ({
        ...previous,
        startingUnits: currentBalance,
        remainingUnits: currentBalance,
      }));
    }
  }, [editId, formData.startingUnits, summary.remainingUnits, summaryQuery.isPending]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const payload = {
      date: formData.date,
      operation: formData.operation.trim(),
      starting_units: Number(formData.startingUnits),
      remaining_units: Number(formData.remainingUnits),
      total_amount: Number(formData.totalAmount),
      notes: formData.notes.trim() || undefined,
    };

    try {
      const saved = editId
        ? await updateMutation.mutateAsync({ id: editId, payload })
        : await createMutation.mutateAsync(payload);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.operationalCosts.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.activities.all }),
      ]);
      setFormData({
        ...emptyForm,
        startingUnits: saved.remaining_units,
        remainingUnits: saved.remaining_units,
      });
      setEditId(null);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not save this operational cost.'));
    }
  };

  const handleEdit = (record: OperationalCost) => {
    setFormData({
      date: record.date,
      operation: record.operation,
      startingUnits: record.starting_units,
      remainingUnits: record.remaining_units,
      totalAmount: record.total_amount,
      notes: record.notes ?? '',
    });
    setEditId(record.id);
    setFormError(null);
  };

  const handleCancelEdit = () => {
    setFormData({ ...emptyForm, startingUnits: String(summary.remainingUnits), remainingUnits: String(summary.remainingUnits) });
    setEditId(null);
    setFormError(null);
  };

  const handleDelete = async (record: OperationalCost) => {
    if (!window.confirm(`Delete the operational record "${record.operation}"?`)) return;
    setFormError(null);
    try {
      await deleteMutation.mutateAsync(record.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.operationalCosts.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
      ]);
    } catch (error) {
      setFormError(getErrorMessage(error, 'Could not delete this record. Later readings may rely on it.'));
    }
  };

  return {
    formData,
    records: recordsQuery.data ?? [],
    summary,
    editId,
    error: formError ?? (recordsQuery.isError || summaryQuery.isError ? 'Failed to load electricity operations.' : null),
    loading: recordsQuery.isPending || summaryQuery.isPending,
    saving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    handleChange,
    handleSave,
    handleEdit,
    handleCancelEdit,
    handleDelete,
  };
}
