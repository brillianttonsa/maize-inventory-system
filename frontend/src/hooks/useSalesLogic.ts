import { useState, type ChangeEvent, type FormEvent } from 'react';
import axios from 'axios';
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
  sackCount: string;
  sackSize: string;
  pricePerSack: string;
  deliveryCost: string;
  deliveryAddress: string;
}

const initialFormData: SaleFormData = {
  customerName: '',
  customerContact: '',
  date: getTodayDate(),
  productType: 'flour',
  sackCount: '',
  sackSize: '',
  pricePerSack: '',
  deliveryCost: '',
  deliveryAddress: '',
};

export const useSalesLogic = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<SaleFormData>(initialFormData);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productFilter, setProductFilter] = useState('All');
  const [sackSizeFilter, setSackSizeFilter] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const salesQuery = useQuery({
    queryKey: queryKeys.sales.page(currentPage, itemsPerPage, productFilter, sackSizeFilter),
    queryFn: () =>
      salesService.getPage(currentPage, itemsPerPage, {
        productType: productFilter,
        sackSize: sackSizeFilter,
      }),
    placeholderData: keepPreviousData,
  });
  const summaryQuery = useQuery({
    queryKey: [...queryKeys.sales.all, 'summary'],
    queryFn: salesService.getSummary,
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

  const handleFilterChange = (name: 'productType' | 'sackSize', value: string) => {
    if (name === 'productType') {
      setProductFilter(value);
      if (value === 'bran') setSackSizeFilter('');
    } else {
      setSackSizeFilter(value);
    }
    setCurrentPage(1);
  };

  const { sackCount, sackSize, pricePerSack, productType } = formData;
  const isBran = productType === 'bran';

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const {
      customerName,
      customerContact,
      date,
      productType,
      pricePerSack,
      deliveryCost,
      deliveryAddress,
    } = formData;

    const payload = {
      customer_name: customerName,
      customer_contact: customerContact,
      date,
      product_type: productType,
      sack_count: Number(sackCount),
      ...(!isBran && { sack_size: Number(sackSize) as 5 | 10 | 25 }),
      price_per_sack: Number(pricePerSack),
      delivery_cost: Number(deliveryCost),
      delivery_address: deliveryAddress,
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
      if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
        const message = error.response?.data?.message;
        setFormError(
          Array.isArray(message)
            ? message.join(', ')
            : message ?? 'Could not save the sale.',
        );
      } else {
        setFormError('Could not save the sale.');
      }
    }
  };

  const handleEdit = (sale: Sale) => {
    setFormData({
      customerName: sale.customer_name,
      customerContact: sale.customer_contact,
      date: sale.date,
      productType: sale.product_type,
      sackCount: sale.sack_count ? String(sale.sack_count) : '',
      sackSize: sale.sack_size ? String(sale.sack_size) : '',
      pricePerSack: String(sale.price_per_sack),
      deliveryCost: String(sale.delivery_cost),
      deliveryAddress: sale.delivery_address,
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
    currentPage,
    currentSales,
    totalPages,
    productFilter,
    sackSizeFilter,
    handleFilterChange,
    summary: summaryQuery.data ?? { flour5kg: 0, flour10kg: 0, flour25kg: 0, bran: 0 },
    summaryLoading: summaryQuery.isPending,
    summaryError: summaryQuery.isError ? 'Failed to load sales summary.' : null,
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
