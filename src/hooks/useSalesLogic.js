import { useState, useEffect } from "react";
import { salesService } from "../services/salesService";
import { getTodayDate } from "../components/utils/todaydate";
import { resetForm } from "../components/common/ResetForm";
import { checkingValidityCountOfNote, wordCounts } from "../components/common/NotesMaxCount";
import { formatData } from "../components/utils/formatDate";

const initialFormData = {
  customerName: "",
  customerContact: "",
  date: getTodayDate(),
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
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // ---  Fetch sales ---
  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await salesService.getAll();
      const formatted = formatData(data)
     
      setSales(formatted);
    } catch (error) {
      console.error(error);
      setError("Fail searching sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

 

  // --- Form Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    if (checkingValidityCountOfNote(name, value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const wordCount = wordCounts(formData);

  const { quantity, pricePerKg} = formData;

  const totalCost = (+(quantity * +pricePerKg)).toFixed(2);

  // --- Combined Submit/Update Logic ---
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { customerName, customerContact, date, productType, quantity, pricePerKg, deliveryCost, deliveryAddress, paymentMethod, notes} = formData;
    
    // Convert form data (camelCase) to backend payload (snake_case)
    const payload = {
        customer_name: customerName,
        customer_contact: customerContact,
        date,
        product_type: productType,
        quantity,
        price_per_kg: pricePerKg,
        delivery_cost: deliveryCost,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        notes,
        total_amount: totalCost
    };
    
    try {
      const newSale = editId
        ? await salesService.update(editId, payload)
        : await salesService.create(payload);

      const data2 = editId ? sales.map(o => (o.id === editId ?  newSale : o)) : [...sales,newSale]
      const formatted2 = formatData(data2)
      setSales(formatted2);

      fetchSales()
      resetForm({initialFormData, setFormData, setEditId});

    } catch (error) {
      console.error(error);
      setError("Sale record fail")
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
      date: sale.date,
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

  const handleCancelEdit = () => {
    resetForm({initialFormData, setFormData, setEditId})
    setError(null)
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this sale record?")) {
      try {
        await salesService.remove(id);
        // Optimistically remove from state OR re-fetch
        fetchSales(); 
      } catch (error) {
        console.error("Error deleting sale:", error);
      }
    }
  };
  
 

   // --- Pagination Logic ---
   const indexOfLast = currentPage * itemsPerPage;
   const indexOfFirst = indexOfLast - itemsPerPage;
   const currentSales = sales.slice(indexOfFirst, indexOfLast);
   const totalPages = Math.ceil(sales.length / itemsPerPage);
   const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return {
    formData,
    wordCount,
    sales,
    error,
    sales,
    loading,
    saving,
    editId,
    totalCost,
    currentPage,
    currentSales,
    totalPages,
    indexOfFirst, // Used for batch numbering in table
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    paginate
  };
};