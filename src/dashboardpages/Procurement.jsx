
import { useState, useEffect } from "react"
import api from "../services/api"

const Procurement = () => {
  const { darkMode } = "dark"

  const [formData, setFormData] = useState({
    supplier: "",
    quantity: "",
    pricePerKg: "",
    transportCost: "",
    deliveryDate: "",
    quality: "high",
    notes: "",
  })

  const [orders, setOrders] = useState([])
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Fetch orders from backend
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get("/procurement")
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "notes") {
      const words = value.trim().split(/\s+/)
      if (words.length > 7) return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
  
    const payload = {
      supplier: formData.supplier,
      quantity: parseFloat(formData.quantity),
      price_per_kg: parseFloat(formData.pricePerKg),
      transport_cost: parseFloat(formData.transportCost),
      delivery_date: formData.deliveryDate,
      quality: formData.quality,
      notes: formData.notes,
      total_cost: (parseFloat(formData.quantity) * parseFloat(formData.pricePerKg) + parseFloat(formData.transportCost)).toFixed(2)
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
  
      setFormData({
        supplier: "",
        quantity: "",
        pricePerKg: "",
        transportCost: "",
        deliveryDate: "",
        quality: "high",
        notes: "",
      })
    } catch (err) {
      console.error("Failed to submit order:", err.response || err)
      alert(err.response?.data?.message || "Something went wrong. Check console.")
    }
  }
  

    const handleEdit = (order) => {
      setFormData({
        supplier: order.supplier,
        quantity: order.quantity,
        pricePerKg: order.price_per_kg || order.pricePerKg,
        transportCost: order.transport_cost || order.transportCost,
        deliveryDate: new Date(order.delivery_date || order.deliveryDate).toISOString().split("T")[0],
        quality: order.quality,
        notes: order.notes,
      })
      setEditId(order.id)
    }

    const handleDelete = async (id) => {
      if (confirm("Are you sure you want to delete this order?")) {
        try {
          await api.delete(`/procurement/${id}`)
          fetchOrders()
        } catch (err) {
          console.error(err)
        }
      }
    }

  // Pagination
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentOrders = orders.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-1">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Order" : "New Maize Order"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Supplier</label>
              <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Quantity (kg)</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Price per kg (/=)</label>
                <input type="number" step="0.01" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Transport Cost (/=)</label>
                <input type="number" step="0.01" name="transportCost" value={formData.transportCost} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Delivery Date</label>
                <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Quality</label>
              <select name="quality" value={formData.quality} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`}></textarea>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
  {formData.notes.trim().split(/\s+/).filter(Boolean).length}/7 words
</p>

            </div>

            <button type="submit" className="w-full py-2 px-4 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              {editId ? "Update Order" : "Place Order"}
            </button>
          </form>
        </div>
      </div>

      {/* Orders Table */}
      <div className="lg:col-span-2">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
  <thead>
    <tr>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>#</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Supplier</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Quantity / Price per kg</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Quality</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Transport Cost</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Cost</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Delivery Date</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Notes</th>
      <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Action</th>
    </tr>
  </thead>
  <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
  {orders.length === 0 ? (
    <tr>
      <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
        No orders yet.
      </td>
    </tr>
  ) : (
    currentOrders.map((order, index) => (
      <tr key={order.id}>
        <td className="px-4 py-4 whitespace-nowrap font-medium">{indexOfFirst + index + 1}</td>
        <td className="px-4 py-4 whitespace-nowrap font-medium">{order.supplier}</td>
        <td className="px-4 py-4 whitespace-nowrap">{order.quantity} kg / {order.price_per_kg || order.pricePerKg}/=</td>
        <td className="px-4 py-4 whitespace-nowrap">{order.quality}</td>
        <td className="px-4 py-4 whitespace-nowrap">{order.transport_cost || order.transportCost}/=</td>
        <td className="px-4 py-4 whitespace-nowrap">{order.total_cost || order.totalCost}/=</td>
        <td className="px-4 py-4 whitespace-nowrap">{new Date(order.delivery_date || order.deliveryDate).toLocaleDateString()}</td>
        <td className="px-4 py-4 whitespace-nowrap">{order.notes || "N/A"}</td>
        <td className="px-4 py-4 whitespace-nowrap">
          <button className="text-blue-600 mr-2" onClick={() => handleEdit(order)}>Edit</button>
          <button className="text-red-600" onClick={() => handleDelete(order.id)}>Delete</button>
        </td>
      </tr>
    ))
  )}
</tbody>

</table>


          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Procurement
