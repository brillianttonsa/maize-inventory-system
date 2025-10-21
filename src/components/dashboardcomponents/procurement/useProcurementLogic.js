
import { useState, useEffect } from "react"
import api from "../../../services/api"

const initialFormData = {
  supplier: "",
  quantity: "",
  pricePerKg: "",
  transportCost: "",
  deliveryDate: "",
  notes: "",
}
const itemsPerPage = 5

export const useProcurementLogic = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [orders, setOrders] = useState([])
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // --- API / CRUD OPERATIONS ---

  const fetchOrders = async () => {
    try {
      const res = await api.get("/procurement")
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const quantity = parseFloat(formData.quantity)
    const pricePerKg = parseFloat(formData.pricePerKg)
    const transportCost = parseFloat(formData.transportCost)
    const totalCost = (quantity * pricePerKg + transportCost).toFixed(2)

    const payload = {
      supplier: formData.supplier,
      quantity: quantity,
      price_per_kg: pricePerKg,
      transport_cost: transportCost,
      delivery_date: formData.deliveryDate,
      notes: formData.notes,
      total_cost: totalCost,
    }

    try {
      if (editId) {
        const res = await api.put(`/procurement/${editId}`, payload)
        setOrders(orders.map(order => order.id === editId ? res.data : order))
        setEditId(null)
      } else {
        const res = await api.post('/procurement', payload)
        setOrders([res.data, ...orders])
      }
      setFormData(initialFormData)
    } catch (err) {
      console.error("Failed to submit order:", err.response || err)
      alert(err.response?.data?.message || "Something went wrong. Check console.")
    }
  }

  const handleEdit = (order) => {
    setFormData({
      supplier: order.supplier || "",
      quantity: order.quantity || "",
      pricePerKg: order.price_per_kg || order.pricePerKg || "",
      transportCost: order.transport_cost || order.transportCost || "",
      deliveryDate: new Date(order.delivery_date || order.deliveryDate).toISOString().split("T")[0],
      notes: order.notes || "",
    })
    setEditId(order.id)
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setFormData(initialFormData)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await api.delete(`/procurement/${id}`)
        setOrders(orders.filter(order => order.id !== id))
      } catch (err) {
        console.error(err)
      }
    }
  }

  // --- PAGINATION LOGIC ---

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentOrders = orders.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return {
    // Data/State
    formData,
    orders,
    editId,
    currentPage,
    currentOrders,
    totalPages,
    indexOfFirst,

    // Handlers/Setters
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    paginate,
  }
}