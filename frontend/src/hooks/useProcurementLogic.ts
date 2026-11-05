import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { procurementService } from '../services/procurementApi';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { formatData } from '../components/utils/formatDate';
import type { ProcurementOrder } from '../types';
import type { ProcurementPayload } from '../services/procurementApi';
import { invalidateRecordQueries, queryKeys } from '../services/queryKeys';

interface ProcurementFormData {
  supplier: string;
  supplierLocation: string;
  supplierPhone: string;
  quantityTons: string;
  maizePurchaseCost: string;
  transportCost: string;
  collectionLabour: string;
  loadingLabour: string;
  unloadingLabour: string;
  transportTax: string;
  ruralTax: string;
  deliveryDate: string;
}

const initialFormData: ProcurementFormData = {
  supplier: '',
  supplierLocation: '',
  supplierPhone: '',
  quantityTons: '',
  maizePurchaseCost: '',
  transportCost: '',
  collectionLabour: '',
  loadingLabour: '',
  unloadingLabour: '',
  transportTax: '',
  ruralTax: '',
  deliveryDate: getTodayDate(),
};

export const useProcurementLogic = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProcurementFormData>(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const ordersQuery = useQuery({
    queryKey: queryKeys.procurement.page(currentPage, itemsPerPage),
    queryFn: () => procurementService.getPage(currentPage, itemsPerPage),
    placeholderData: keepPreviousData,
  });
  const summaryQuery = useQuery({ queryKey: [...queryKeys.procurement.all, 'summary'], queryFn: procurementService.getSummary });
  const createMutation = useMutation({
    mutationFn: procurementService.create,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.procurement.all),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProcurementPayload> }) =>
      procurementService.update(id, payload),
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.procurement.all),
  });
  const deleteMutation = useMutation({
    mutationFn: procurementService.remove,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.procurement.all),
  });
  const orders = formatData(ordersQuery.data?.items ?? []);
  const loading = ordersQuery.isPending;
  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const error = formError ?? (ordersQuery.isError ? 'Failed to load procurement orders.' : null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const { supplier, supplierLocation, supplierPhone, quantityTons, maizePurchaseCost, transportCost, collectionLabour, loadingLabour, unloadingLabour, transportTax, ruralTax, deliveryDate } = formData;

    const payload = {
      supplier,
      supplier_location: supplierLocation,
      supplier_phone: supplierPhone,
      quantity_tons: Number(quantityTons),
      maize_purchase_cost: Number(maizePurchaseCost),
      transport_cost: Number(transportCost),
      collection_labour: Number(collectionLabour || 0),
      loading_labour: Number(loadingLabour || 0),
      unloading_labour: Number(unloadingLabour || 0),
      transport_tax: Number(transportTax || 0),
      rural_tax: Number(ruralTax || 0),
      delivery_date: deliveryDate,
    };

    try {
      const wasCreating = !editId;
      if (editId) {
        await updateMutation.mutateAsync({ id: editId, payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      if (wasCreating) {
        const lastPage = Math.max(1, Math.ceil(((ordersQuery.data?.total ?? 0) + 1) / itemsPerPage));
        setCurrentPage(lastPage);
      }
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (err) {
      console.error(err);
      setFormError(`Failed to ${editId ? 'update' : 'save'} order.`);
    }
  };

  const handleEdit = (order: ProcurementOrder) => {
    setFormData({
      supplier: order.supplier,
      supplierLocation: order.supplier_location ?? '',
      supplierPhone: order.supplier_phone ?? '',
      quantityTons: String(order.quantity_of_maize),
      maizePurchaseCost: String(order.maize_purchase_cost),
      transportCost: String(order.transport_cost),
      collectionLabour: String(order.collection_labour ?? ''),
      loadingLabour: String(order.loading_labour ?? ''),
      unloadingLabour: String(order.unloading_labour ?? ''),
      transportTax: String(order.transport_tax ?? ''),
      ruralTax: String(order.rural_tax ?? ''),
      deliveryDate: order.delivery_date,
    });
    setEditId(order.id);
  };

  const handleCancelEdit = () => {
    resetForm({ initialFormData, setFormData, setEditId });
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are sure you want to delete this order data?')) {
      try {
        await deleteMutation.mutateAsync(id);
        const nextTotal = Math.max(0, (ordersQuery.data?.total ?? 0) - 1);
        setCurrentPage((page) => Math.min(page, Math.max(1, Math.ceil(nextTotal / itemsPerPage))));
      } catch (error) {
        console.error('Error deleting order:', error);
        setFormError('Error in deleting order');
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = orders;
  const totalPages = ordersQuery.data?.totalPages ?? 0;
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
    orders,
    currentOrders,
    indexOfFirst,
    totalPages,
    totalRecords: ordersQuery.data?.total ?? 0,
    currentPage,
    paginate,
    summary: summaryQuery.data ?? { totalQuantityKg: 0, totalCost: 0, actualMaizePurchase: 0, averageTotalCostPerKg: 0 },
    summaryLoading: summaryQuery.isPending,
    summaryError: summaryQuery.isError ? 'Failed to load procurement summary.' : null,
  };
};
