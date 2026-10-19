import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { productionService } from '../services/productionApi';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { formatData } from '../components/utils/formatDate';
import type { ProductionBatch } from '../types';
import type { ProductionPayload } from '../services/productionApi';
import { invalidateRecordQueries, queryKeys } from '../services/queryKeys';

interface ProductionFormData {
  maizeTons: string;
  flourSacks5kg: string;
  flourSacks10kg: string;
  flourSacks25kg: string;
  branUnitCount: string;
  date: string;
}

const initialFormData: ProductionFormData = {
  maizeTons: '',
  flourSacks5kg: '',
  flourSacks10kg: '',
  flourSacks25kg: '',
  branUnitCount: '',
  date: getTodayDate(),
};

export const useProductionLogic = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProductionFormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const batchesQuery = useQuery({
    queryKey: queryKeys.production.page(currentPage, itemsPerPage),
    queryFn: () => productionService.getPage(currentPage, itemsPerPage),
    placeholderData: keepPreviousData,
  });
  const createMutation = useMutation({
    mutationFn: productionService.create,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.production.all),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProductionPayload> }) =>
      productionService.update(id, payload),
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.production.all),
  });
  const deleteMutation = useMutation({
    mutationFn: productionService.remove,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.production.all),
  });
  const batches = formatData(batchesQuery.data?.items ?? []);
  const loading = batchesQuery.isPending;
  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const error = formError ?? (batchesQuery.isError ? 'Failed to load production batches.' : null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const { maizeTons, flourSacks5kg, flourSacks10kg, flourSacks25kg, branUnitCount, date } =
      formData;

    const payload = {
      maize_tons: Number(maizeTons),
      flour_sacks_5kg: Number(flourSacks5kg || 0),
      flour_sacks_10kg: Number(flourSacks10kg || 0),
      flour_sacks_25kg: Number(flourSacks25kg || 0),
      ...(branUnitCount ? { bran_unit_count: Number(branUnitCount), bran_unit: 'gunia' as const } : {}),
      date,
    };

    try {
      const wasCreating = !editId;
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      if (wasCreating) {
        const lastPage = Math.max(1, Math.ceil(((batchesQuery.data?.total ?? 0) + 1) / itemsPerPage));
        setCurrentPage(lastPage);
      }
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (err) {
      console.error(err);
      setFormError('Batch record fail');
    }
  };

  const handleEdit = (batch: ProductionBatch) => {
    setFormData({
      maizeTons: String(batch.maize_quantity / 1000),
      flourSacks5kg: String(batch.flour_sacks_5kg || ''),
      flourSacks10kg: String(batch.flour_sacks_10kg || ''),
      flourSacks25kg: String(batch.flour_sacks_25kg || ''),
      branUnitCount: batch.bran_debe_quantity ? String(Number(batch.bran_debe_quantity) / 7) : '',
      date: batch.date,
    });
    setEditId(batch.id);
  };

  const handleCancelEdit = () => {
    resetForm({ initialFormData, setFormData, setEditId });
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this batch data?')) {
      try {
        await deleteMutation.mutateAsync(id);
        const nextTotal = Math.max(0, (batchesQuery.data?.total ?? 0) - 1);
        setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(nextTotal / itemsPerPage))));
      } catch (error) {
        console.error('Error deleting batch:', error);
        setFormError('Error in deleting batch');
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBatches = batches;
  const totalPages = batchesQuery.data?.totalPages ?? 0;
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    formData,
    error,
    saving,
    loading,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    editId,
    batches,
    currentBatches,
    indexOfFirst,
    totalPages,
    totalRecords: batchesQuery.data?.total ?? 0,
    currentPage,
    paginate,
  };
};
