import { useState, useEffect } from "react";
import { procurementService } from "../services/procurementApi";
import { getTodayDate } from "../components/utils/todaydate";
import { resetForm } from "../components/common/ResetForm"; //reset function
import { checkingValidityCountOfNote, wordCounts } from "../components/common/NotesMaxCount";

const initialFormData = {
    supplier: "",
    quantity: "",
    pricePerKg: "",
    transportCost: "",
    deliveryDate: getTodayDate(),
    notes: "",
}

export const useProcurementLogic = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
 
   // --- FETCH ORDERS ---
  const fetchOrders = async () => {
    
    try{
      setLoading(true);
      await procurementService.getAll().then(setOrders);
    }catch(error){
        console.log(error);
        setError("Fail searching orders");
    } finally{
      setLoading(false)
    }
  }


  // --- FETCH ---
  useEffect(() => {
    fetchOrders()
  }, []);

  // -- Handling change --
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null)
    if (checkingValidityCountOfNote(name,value)) return; // Ensuring notes words are not more than 3
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // word counts in notes input
  const wordCount = wordCounts(formData)


  // --- SUBMIT / UPDATE---
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true)
    setError("")
    const { supplier, quantity, pricePerKg, transportCost, deliveryDate, notes } = formData;
    
    // changing form datas to snake form
    const payload = {
      supplier,
      quantity: Number(quantity),
      price_per_kg: Number(pricePerKg),
      transport_cost: Number(transportCost),
      delivery_date: deliveryDate,
      notes,
      total_cost: Number(((quantity * pricePerKg) + transportCost)).toFixed(2),
    };

    try {
      const newOrder = editId
        ? await procurementService.update(editId, payload)
        : await procurementService.create(payload);

      setOrders(prev =>
        editId ? prev.map(o => (o.id === editId ?  newOrder : o)) : [...prev,newOrder]
      );

      resetForm({initialFormData, setFormData, setEditId})
    } catch (err) {
      console.error(err);
      setError("Order record fail")
    } finally {
      setSaving(false)     
    }
  };

  // --- EDIT ---
  const handleEdit = (order) => {
    setFormData({
      supplier: order.supplier,
      quantity: order.quantity,
      pricePerKg: order.price_per_kg,
      transportCost: order.transport_cost,
      deliveryDate: order.delivery_date,
      notes: order.notes,
    });
    setEditId(order.id);
  };

    // Cancel function
  const handleCancelEdit = () => {
    resetForm({initialFormData, setFormData, setEditId})
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    await procurementService.remove(id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };


  // --- PAGINATION ---
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- RETURN ---
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
    orders,
    currentOrders,
    indexOfFirst,
    totalPages,
    currentPage,
    paginate,
  };
};
