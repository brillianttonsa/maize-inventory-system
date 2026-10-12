import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { procurementService } from '../services/procurementApi';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { formatData } from '../components/utils/formatDate';
import type { ProcurementOrder } from '../types';

interface ProcurementFormData {
  supplier: string;
  quantityTons: string;
  pricePerKg: string;
  transportCost: string;
  deliveryDate: string;
}

const initialFormData: ProcurementFormData = {
  supplier: '',
  quantityTons: '',
  pricePerKg: '',
  transportCost: '',
  deliveryDate: getTodayDate(),
};

export const useProcurementLogic = () => {
  const [formData, setFormData] = useState<ProcurementFormData>(initialFormData);
  const [orders, setOrders] = useState<ProcurementOrder[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await procurementService.getAll();
      setOrders(formatData(data));
    } catch (error) {
      console.error(error);
      setError('Fail searching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { quantityTons, pricePerKg, transportCost } = formData;
  const quantityKg = Number(quantityTons) * 1000;
  const totalCost = quantityKg * Number(pricePerKg) + Number(transportCost);

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { supplier, quantityTons, pricePerKg, transportCost, deliveryDate } = formData;

    const payload = {
      supplier,
      quantity_tons: Number(quantityTons),
      price_per_kg: Number(pricePerKg),
      transport_cost: Number(transportCost),
      delivery_date: deliveryDate,
      total_cost: totalCost,
    };

    try {
      const newOrder = editId
        ? await procurementService.update(editId, payload)
        : await procurementService.create(payload);

      const data2 = editId ? orders.map((o) => (o.id === editId ? newOrder : o)) : [...orders, newOrder];
      setOrders(formatData(data2));
      fetchOrders();
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editId ? 'update' : 'save'} order.`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (order: ProcurementOrder) => {
    setFormData({
      supplier: order.supplier,
      quantityTons: String(Number(order.quantity) / 1000),
      pricePerKg: String(order.price_per_kg),
      transportCost: String(order.transport_cost),
      deliveryDate: order.delivery_date,
    });
    setEditId(order.id);
  };

  const handleCancelEdit = () => {
    resetForm({ initialFormData, setFormData, setEditId });
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are sure you want to delete this order data?')) {
      try {
        await procurementService.remove(id);
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } catch (error) {
        console.error('Error deleting order:', error);
        setError('Error in deleting order');
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
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
    currentPage,
    paginate,
    totalCost,
  };
};
