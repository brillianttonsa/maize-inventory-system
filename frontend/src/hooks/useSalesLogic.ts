import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { salesService } from '../services/salesService';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { formatData } from '../components/utils/formatDate';
import type { Sale } from '../types';
import type { SalePayload } from '../services/salesService';
import { invalidateRecordQueries, queryKeys } from '../services/queryKeys';

interface SaleFormData {
  customerName: string;
  customerContact: string;
  date: string;
  productType: string;
  quantity: string;
  sackCount: string;
  sackSize: string;
  branUnitCount: string;
  branUnit: 'gunia';
  pricePerKg: string;
  deliveryCost: string;
  deliveryAddress: string;
  paymentMethod: string;
}

const initialFormData: SaleFormData = {
  customerName: '',
  customerContact: '',
  date: getTodayDate(),
  productType: 'flour',
  quantity: '',
  sackCount: '',
  sackSize: '',
  branUnitCount: '',
  branUnit: 'gunia',
  pricePerKg: '',
  deliveryCost: '',
  deliveryAddress: '',
  paymentMethod: 'cash',
};

export const useSalesLogic = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SaleFormData>(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const salesQuery = useQuery({
    queryKey: queryKeys.sales.page(currentPage, itemsPerPage),
    queryFn: () => salesService.getPage(currentPage, itemsPerPage),
    placeholderData: keepPreviousData,
  });
  const createSaleMutation = useMutation({
    mutationFn: salesService.create,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.sales.all),
  });
  const updateSaleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SalePayload> }) =>
      salesService.update(id, payload),
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.sales.all),
  });
  const deleteSaleMutation = useMutation({
    mutationFn: salesService.remove,
    onSuccess: () => invalidateRecordQueries(queryClient, queryKeys.sales.all),
  });

  const sales = formatData(salesQuery.data?.items ?? []);
  const totalSales = salesQuery.data?.total ?? 0;
  const loading = salesQuery.isPending;
  const saving =
    createSaleMutation.isPending ||
    updateSaleMutation.isPending ||
    deleteSaleMutation.isPending;
  const error = formError ?? (salesQuery.isError ? 'Failed to load sales records.' : null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormError(null);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { sackCount, sackSize, branUnitCount, branUnit, pricePerKg, productType } = formData;
  const isBran = productType === 'bran';
  const quantity = isBran ? Number(branUnitCount) * 7 : Number(sackCount) * Number(sackSize);
  const totalCost = ((isBran ? Number(branUnitCount) : Number(sackCount)) * Number(pricePerKg)).toFixed(2);

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const {
      customerName,
      customerContact,
      date,
      productType,
      quantity,
      pricePerKg,
      deliveryCost,
      deliveryAddress,
      paymentMethod,
    } = formData;

    const payload = {
      customer_name: customerName,
      customer_contact: customerContact,
      date,
      product_type: productType,
      quantity: Number(quantity),
      ...(isBran
        ? { bran_unit_count: Number(branUnitCount), bran_unit: 'gunia' as const }
        : { sack_count: Number(sackCount), sack_size: Number(sackSize) as 5 | 10 | 25 }),
      price_per_kg: Number(pricePerKg),
      delivery_cost: Number(deliveryCost),
      delivery_address: deliveryAddress,
      payment_method: paymentMethod,
      total_amount: Number(totalCost),
    };

    try {
      if (editId) {
        await updateSaleMutation.mutateAsync({ id: editId, payload });
      } else {
        await createSaleMutation.mutateAsync(payload);
      }
      if (!editId) {
        const lastPage = Math.max(1, Math.ceil((totalSales + 1) / itemsPerPage));
        setCurrentPage(lastPage);
      }
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (error) {
      console.error(error);
      setFormError('Sale record fail');
    }
  };

  const handleEdit = (sale: Sale) => {
    setFormData({
      customerName: sale.customer_name,
      customerContact: sale.customer_contact,
      date: sale.date,
      productType: sale.product_type,
      quantity: String(sale.quantity),
      sackCount: sale.sack_count ? String(sale.sack_count) : '',
      sackSize: sale.sack_size ? String(sale.sack_size) : '',
      branUnitCount: sale.bran_unit_count ? String(sale.bran_unit_count) : '',
      branUnit: 'gunia',
      pricePerKg: String(sale.price_per_kg),
      deliveryCost: String(sale.delivery_cost),
      deliveryAddress: sale.delivery_address,
      paymentMethod: sale.payment_method,
    });
    setEditId(sale.id);
  };

  const handleCancelEdit = () => {
    resetForm({ initialFormData, setFormData, setEditId });
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale record?')) {
      try {
        await deleteSaleMutation.mutateAsync(id);
        const nextTotal = Math.max(0, totalSales - 1);
        const nextPage = Math.min(
          currentPage,
          Math.max(1, Math.ceil(nextTotal / itemsPerPage)),
        );
        setCurrentPage(nextPage);
      } catch (error) {
        console.error('Error deleting sale:', error);
        setFormError('Error deleting sale.');
      }
    }
  };

  const indexOfFirst = (currentPage - 1) * itemsPerPage;
  const currentSales = sales;
  const totalPages = Math.ceil(totalSales / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    formData,
    sales,
    error,
    loading,
    saving,
    editId,
    totalCost,
    currentPage,
    currentSales,
    totalPages,
    indexOfFirst,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    paginate,
    updating: salesQuery.isFetching && !salesQuery.isPending,
    loadError: salesQuery.isError ? 'Unable to load sales records. Please try again.' : null,
  };
};
