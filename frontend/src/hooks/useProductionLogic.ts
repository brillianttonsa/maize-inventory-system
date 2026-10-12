import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { productionService } from '../services/productionApi';
import { getTodayDate } from '../components/utils/todaydate';
import { resetForm } from '../components/dashboard/common/ResetForm';
import { formatData } from '../components/utils/formatDate';
import type { ProductionBatch } from '../types';

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
  const [formData, setFormData] = useState<ProductionFormData>(initialFormData);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const itemsPerPage = 5;

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const data = await productionService.getAll();
      setBatches(formatData(data));
    } catch (err) {
      console.error(err);
      setError('Fail searching batches');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setError(null);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOrUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
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
      const newBatch = editId
        ? await productionService.update(editId, payload)
        : await productionService.create(payload);

      const data2 = editId ? batches.map((o) => (o.id === editId ? newBatch : o)) : [...batches, newBatch];
      setBatches(formatData(data2));

      fetchBatches();
      resetForm({ initialFormData, setFormData, setEditId });
    } catch (err) {
      console.error(err);
      setError('Batch record fail');
    } finally {
      setSaving(false);
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
    setError(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this batch data?')) {
      try {
        await productionService.remove(id);
        fetchBatches();
      } catch (error) {
        console.error('Error deleting batch:', error);
        setError('Error in deleting batch');
      }
    }
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBatches = batches.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(batches.length / itemsPerPage);
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
    currentPage,
    paginate,
  };
};
