import { useState, useEffect } from "react";
import { productionService } from "../services/productionApi";
import { getTodayDate } from "../components/utils/todaydate";
import { resetForm } from "../components/common/ResetForm"; //reset function
import { checkingValidityCountOfNote, wordCounts } from "../components/common/NotesMaxCount";

const initialFormData = {
  maizeQuantity: "",
  flourOutput: "",
  branOutput: "",
  waterUsage: "",
  electricityUsage: "",
  sacksUsed: "",
  notes: "",
  date: getTodayDate(),
};

export const useProductionLogic = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const itemsPerPage = 5;


  // --- FETCH ORDERS ---
  const fetchBatches = async () => {
    try {
      setLoading(true);
      await productionService.getAll().then(setBatches);
    } catch (err) {
      console.error(err);
      setError("Fail searching batches");
    } finally {
      setLoading(false);
    }
  };

  // -- FETCH --
  useEffect(() => {
    fetchBatches();
  }, []);

  

  // -- Handling change --
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null)
    if (checkingValidityCountOfNote(name,value)) return; // Ensuring notes words are not more than 3
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData.notes);
  };

  // word counts in notes input
  const wordCount = wordCounts(formData)

  // --- SUBMIT / UPDATE---
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true)
    setError("")
    const {
      maizeQuantity, flourOutput, branOutput, waterUsage, electricityUsage, sacksUsed, notes, date
    } = formData

    // changing form datas to snake form
    const payload = {
      maize_quantity: Number(maizeQuantity),
      flour_output: Number(flourOutput),
      bran_output: Number(branOutput),
      water_usage: Number(waterUsage),
      electricity_usage: Number(electricityUsage),
      sacks_used: Number(sacksUsed),
      notes: notes,
      date: date,
    };

    try {
      const newBatch = editId
      ? await productionService.update(editId, payload)
      : await productionService.create(payload);

      setBatches(prev => 
        editId? prev.map(o => (o.id === editId? newBatch : o)) : [...prev, newBatch]
      );
      console.log(formData);

      resetForm({initialFormData, setFormData, setEditId})
    } catch (err) {
      console.error(err);
      setError("Batch record fail");
    } finally{
      setSaving(false)
    }
  };

  // --- EDIT ---
  const handleEdit = (batch) => {
    setFormData({
      maizeQuantity: batch.maize_quantity,
      flourOutput: batch.flour_output,
      branOutput: batch.bran_output,
      waterUsage: batch.water_usage,
      electricityUsage: batch.electricity_usage,
      sacksUsed: batch.sacks_used,
      notes: batch.notes,
      date: batch.date,
    });
    console.log(formData);
    setEditId(batch.id);
  };

  // Cancel function
  const handleCancelEdit = () => {
    resetForm({initialFormData, setFormData, setEditId})
  };

  // --DELETE--
  const handleDelete = async (id) => {
      await productionService.remove(id);
      setBatches(prev => prev.filter(o => o.id !== id) );
    
  };

  // --- PAGINATION ---
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBatches = batches.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(batches.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  console.log(batches);
  console.log(currentBatches);
  console.log(formData);
  // --RETURN--
  return {
    formData,
    wordCount,
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
    paginate
  };
};
