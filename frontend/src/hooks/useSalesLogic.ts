import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { salesService } from '../services/salesService';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { formatData } from '../components/utils/formatDate';
import type { Sale } from '../types';

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
  const [formData, setFormData] = useState<SaleFormData>(initialFormData);
  const [sales, setSales] = useState<Sale[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await salesService.getAll();
      setSales(formatData(data));
    } catch (error) {
      console.error(error);
      setError('Fail searching sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { sackCount, sackSize, branUnitCount, branUnit, pricePerKg, productType } = formData;
  const isBran = productType === 'bran';
  const quantity = isBran ? Number(branUnitCount) * 7 : Number(sackCount) * Number(sackSize);
  const totalCost = ((isBran ? Number(branUnitCount) : Number(sackCount)) * Number(pricePerKg)).toFixed(2);

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
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
      const newSale = editId ? await salesService.update(editId, payload) : await salesService.create(payload);

      const data2 = editId ? sales.map((o) => (o.id === editId ? newSale : o)) : [...sales, newSale];
      setSales(formatData(data2));

      fetchSales();
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (error) {
      console.error(error);
      setError('Sale record fail');
    } finally {
      setSaving(false);
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
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sale record?')) {
      try {
        await salesService.remove(id);
        fetchSales();
      } catch (error) {
        console.error('Error deleting sale:', error);
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSales = sales.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sales.length / itemsPerPage);
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
  };
};
