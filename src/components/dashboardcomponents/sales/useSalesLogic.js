import { useState, useEffect } from "react";
import api from "../../../services/api";

const initialFormData = {
  customerName: "",
  customerContact: "",
  productType: "flour",
  quantity: "",
  pricePerKg: "",
  deliveryCost: "",
  deliveryAddress: "",
  paymentMethod: "cash",
  notes: "",
};

export const useSalesLogic = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [sales, setSales] = useState([]);
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const itemsPerPage = 5;

  // --- API Fetch (Read) ---
  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sales");
     
      setSales(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // --- Pagination Logic ---
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentSales = sales.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sales.length / itemsPerPage);

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "notes") {
      // Enforce 3-word limit (corrected from original 7-word check)
      const words = value.trim().split(/\s+/).filter(Boolean);
      if (words.length > 3) {
        const trimmed = words.slice(0, 5).join(" ");
        setFormData((prev) => ({ ...prev, [name]: trimmed }));
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditId(null);
  };

  // --- Combined Submit/Update Logic ---
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Convert form data (camelCase) to backend payload (snake_case)
    const payload = {
        customer_name: formData.customerName,
        customer_contact: formData.customerContact,
        product_type: formData.productType,
        quantity: formData.quantity,
        price_per_kg: formData.pricePerKg,
        delivery_cost: formData.deliveryCost,
        delivery_address: formData.deliveryAddress,
        payment_method: formData.paymentMethod,
        notes: formData.notes,
    };
    
    try {
      if (editId) {
        // UPDATE
        await api.put(`/sales/${editId}`, payload);
      } else {
        // CREATE
        await api.post("/sales", payload);
      }

      await fetchSales(); // Re-fetch all sales to update table
      resetForm();
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  // --- Edit, Delete, and Cancel Handlers ---
  const handleEdit = (sale) => {
    // Populate form by mapping snake_case from backend to camelCase for the form state
    setFormData({
      customerName: sale.customer_name,
      customerContact: sale.customer_contact,
      productType: sale.product_type,
      quantity: sale.quantity,
      pricePerKg: sale.price_per_kg,
      deliveryCost: sale.delivery_cost,
      deliveryAddress: sale.delivery_address,
      paymentMethod: sale.payment_method,
      notes: sale.notes,
    });
    setEditId(sale.id); // Activate Edit Mode
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      try {
        await api.delete(`/sales/${id}`);
        // Optimistically remove from state OR re-fetch
        fetchSales(); 
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
  };
  
  const handleCancelEdit = () => {
    resetForm(); // Exits Edit Mode and resets form
  };
  
  return {
    formData,
    sales,
    loading,
    saving,
    editId,
    currentPage,
    currentSales,
    totalPages,
    indexOfFirst, // Used for batch numbering in table
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    setCurrentPage,
    // total sales list exposed for CSV export
    allSales: sales, 
  };
};