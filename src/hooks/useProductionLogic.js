
import { useState, useEffect } from "react";
import { productionService } from "../services/productionApi";
import { getTodayDate } from "../components/utils/todaydate";

const initialFormData = {
  maizeQuantity: "",
  flourOutput: "",
  branOutput: "",
  waterUsage: "",
  electricityUsage: "",
  sacksUsed: "",
  employeeNotes: "",
  date: getTodayDate(),
};

export const useProductionLogic = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBatchId, setEditingBatchId] = useState(null);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const data = await productionService.getAll();

        const formatted = data.map((item) => ({
          id: item.id,
          maizeQuantity: item.maize_quantity,
          flourOutput: item.flour_output,
          branOutput: item.bran_output,
          waterUsage: item.water_usage,
          electricityUsage: item.electricity_usage,
          sacksUsed: item.sacks_used,
          employeeNotes: item.employee_notes,
          date: item.date.slice(0, 10),
        }));

        setBatches(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const totalPages = Math.ceil(batches.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentBatches = batches.slice(startIndex, startIndex + rowsPerPage);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "employeeNotes") {
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 3) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();

    const payload = {
      maizeQuantity: Number(formData.maizeQuantity),
      flourOutput: Number(formData.flourOutput),
      branOutput: Number(formData.branOutput),
      waterUsage: Number(formData.waterUsage),
      electricityUsage: Number(formData.electricityUsage),
      sacksUsed: Number(formData.sacksUsed),
      employeeNotes: formData.employeeNotes,
      date: formData.date,
    };

    try {
      if (editingBatchId) {
        const res = await productionService.update(editingBatchId, payload);

        const updatedBatch = {
          id: editingBatchId,
          maizeQuantity: res.maize_quantity || payload.maizeQuantity,
          flourOutput: res.flour_output || payload.flourOutput,
          branOutput: res.bran_output || payload.branOutput,
          waterUsage: res.water_usage || payload.waterUsage,
          electricityUsage: res.electricity_usage || payload.electricityUsage,
          sacksUsed: res.sacks_used || payload.sacksUsed,
          employeeNotes: res.employee_notes || payload.employeeNotes,
          date: (res.date || payload.date).slice(0, 10),
        };

        setBatches((prevBatches) =>
          prevBatches.map((b) => (b.id === editingBatchId ? updatedBatch : b))
        );
        setEditingBatchId(null);
      } else {
        const res = await productionService.create(payload);

        const newBatch = {
          id: res.id,
          maizeQuantity: res.maize_quantity,
          flourOutput: res.flour_output,
          branOutput: res.bran_output,
          waterUsage: res.water_usage,
          electricityUsage: res.electricity_usage,
          sacksUsed: res.sacks_used,
          employeeNotes: res.employee_notes,
          date: res.date.slice(0, 10),
        };

        setBatches((prevBatches) => [...prevBatches, newBatch]);
      }

      setFormData(initialFormData);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${editingBatchId ? "update" : "save"} production batch.`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productionService.remove(id);
      setBatches((prevBatches) => prevBatches.filter((b) => b.id !== id));
      if (currentBatches.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete batch.");
    }
  };

  const handleEdit = (batch) => {
    setFormData({
      maizeQuantity: batch.maizeQuantity,
      flourOutput: batch.flourOutput,
      branOutput: batch.branOutput,
      waterUsage: batch.waterUsage,
      electricityUsage: batch.electricityUsage,
      sacksUsed: batch.sacksUsed,
      employeeNotes: batch.employeeNotes,
      date: batch.date,
    });
    setEditingBatchId(batch.id);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingBatchId(null);
  };

  return {
    formData,
    batches,
    loading,
    currentPage,
    rowsPerPage,
    totalPages,
    startIndex,
    currentBatches,
    editingBatchId,
    handleChange,
    handleSaveOrUpdate,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    setCurrentPage,
  };
};
