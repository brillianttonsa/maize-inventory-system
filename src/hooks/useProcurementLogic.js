import { useState, useEffect } from "react";
import { procurementService } from "../services/procurementApi";
import { getTodayDate } from "../components/utils/todaydate";
import { resetForm } from "../components/common/ResetForm"; //reset function
import { checkingValidityCountOfNote, wordCounts } from "../components/common/NotesMaxCount";
import { formatData } from "../components/utils/formatDate";

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
      const data = await procurementService.getAll();
      
      const formatted = formatData(data)
      console.log(formatted);
      setOrders(formatted)
    }catch(error){
        console.error(error);
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
  const wordCount = wordCounts(formData);

  const {  quantity, pricePerKg, transportCost } = formData;

  const totalCost = (((+quantity * +pricePerKg) + +transportCost))

  // --- SUBMIT / UPDATE---
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true)
    setError("")
    const { supplier, quantity, pricePerKg, transportCost, deliveryDate, notes } = formData;
    
    // changing form datas to snake form
    const payload = {
      supplier,
      quantity: quantity,
      price_per_kg: pricePerKg,
      transport_cost: transportCost,
      delivery_date: deliveryDate,
      notes,
      total_cost: totalCost
    };

    try {
      const newOrder = editId
        ? await procurementService.update(editId, payload)
        : await procurementService.create(payload);

      
      const data2 = editId ? orders.map(o => (o.id === editId ?  newOrder : o)) : [...orders,newOrder]
      const formatted2 = formatData(data2)
      setOrders(formatted2);
      fetchOrders()
      resetForm({initialFormData, setFormData, setEditId})
    } catch (err) {
      console.error(err);
      setError(`Failed to ${editId ? "update" : "save"} order.`,);
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
    setError(null)
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if (confirm("Are sure you want to delete this order data?")){
      try{
        await procurementService.remove(id);
        setOrders(prev => prev.filter(o => o.id !== id)); 

      } catch (error) {
        console.error("Error deleting order:", error);
        setError("Error in deleting order")
      }
    }
    
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
    totalCost
  };
};
