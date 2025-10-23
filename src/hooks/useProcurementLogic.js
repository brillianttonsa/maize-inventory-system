import { useState, useEffect } from "react";
import { procurementService } from "../services/procurementApi";
import { getTodayDate } from "../components/utils/todaydate";

export const useProcurementLogic = () => {
  const [formData, setFormData] = useState({
    supplier: "",
    quantity: "",
    pricePerKg: "",
    transportCost: "",
    deliveryDate: getTodayDate(),
    notes: "",
  });
  const [orders, setOrders] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- FETCH ---
  useEffect(() => {
    procurementService.getAll().then(setOrders).catch(console.error);
  }, []);

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { supplier, quantity, pricePerKg, transportCost, deliveryDate, notes } = formData;

    const payload = {
      supplier,
      quantity: +quantity,
      price_per_kg: +pricePerKg,
      transport_cost: +transportCost,
      delivery_date: deliveryDate,
      notes,
      total_cost: ((+quantity * +pricePerKg) + +transportCost).toFixed(2),
    };

    try {
      const newOrder = editId
        ? await procurementService.update(editId, payload)
        : await procurementService.create(payload);

      setOrders(prev =>
        editId ? prev.map(o => (o.id === editId ? newOrder : o)) : [...prev,newOrder]
      );

      setFormData({ supplier: "", quantity: "", pricePerKg: "", transportCost: "", deliveryDate: getTodayDate(), notes: "" });
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // --- EDIT ---
  const handleEdit = (order) => {
    setFormData({
      supplier: order.supplier,
      quantity: order.quantity,
      pricePerKg: order.price_per_kg,
      transportCost: order.transport_cost,
      deliveryDate: getTodayDate(),
      notes: order.notes,
    });
    setEditId(order.id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({
      supplier: "",
      quantity: "",
      pricePerKg: "",
      transportCost: "",
      deliveryDate: getTodayDate(),
      notes: "",
    });
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
    setFormData,
    handleSubmit,
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
