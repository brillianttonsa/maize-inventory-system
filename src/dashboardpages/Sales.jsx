"use client"

import { useState, useEffect } from "react"
import api from "../services/api"// your axios.create instance

const Sales = () => {
  const darkMode = false // replace with your actual dark mode state if you have one

  const [formData, setFormData] = useState({
    customerName: "",
    customerContact: "",
    productType: "flour",
    quantity: "",
    pricePerKg: "",
    deliveryCost: "",
    deliveryAddress: "",
    paymentMethod: "cash",
    notes: "",
  })

  const [sales, setSales] = useState([])
  const [editId, setEditId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // 🔹 Fetch sales from backend
  const [loading, setLoading] = useState(true);

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
}


  // 🔹 Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "notes") {
      // Enforce 7-word limit
      const words = value.trim().split(/\s+/).filter(Boolean)
      if (words.length > 7) {
        const trimmed = words.slice(0, 7).join(" ")
        setFormData((prev) => ({ ...prev, [name]: trimmed }))
        return
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // 🔹 Reset form
  const resetForm = () => {
    setFormData({
      customerName: "",
      customerContact: "",
      productType: "flour",
      quantity: "",
      pricePerKg: "",
      deliveryCost: "",
      deliveryAddress: "",
      paymentMethod: "cash",
      notes: "",
    })
    setEditId(null)
  }

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // start loading
  
      if (editId) {
        await api.put(`/sales/${editId}`, {
          customer_name: formData.customerName,
          customer_contact: formData.customerContact,
          product_type: formData.productType,
          quantity: formData.quantity,
          price_per_kg: formData.pricePerKg,
          delivery_cost: formData.deliveryCost,
          delivery_address: formData.deliveryAddress,
          payment_method: formData.paymentMethod,
          notes: formData.notes,
        });
      } else {
        await api.post("/sales", {
          customer_name: formData.customerName,
          customer_contact: formData.customerContact,
          product_type: formData.productType,
          quantity: formData.quantity,
          price_per_kg: formData.pricePerKg,
          delivery_cost: formData.deliveryCost,
          delivery_address: formData.deliveryAddress,
          payment_method: formData.paymentMethod,
          notes: formData.notes,
        });
      }
  
      // ✅ Optional: fake 1s delay to show "loading"
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      await fetchSales();
      resetForm();
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false); // stop loading
    }
  };
  

  // 🔹 Edit Sale
  const handleEdit = (sale) => {
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
    })
    setEditId(sale.id)
  }

  // 🔹 Delete Sale
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      try {
        await api.delete(`/sales/${id}`)
        fetchSales()
      } catch (error) {
        console.error("Error deleting sale:", error)
      }
    }
  }

  // 🔹 Pagination
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentSales = sales.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(sales.length / itemsPerPage)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-1">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-semibold mb-4">{editId ? "Edit Sale" : "Record Sale"}</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Customer Contact</label>
              <input
                type="tel"
                name="customerContact"
                value={formData.customerContact}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Type</label>
                <select name="productType" value={formData.productType} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                  <option value="flour">Flour</option>
                  <option value="bran">Bran</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price per kg (/=)</label>
                <input
                  type="number"
                  step="0.01"
                  name="pricePerKg"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Delivery Cost (/=)</label>
                <input
                  type="number"
                  step="0.01"
                  name="deliveryCost"
                  value={formData.deliveryCost}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Delivery Address</label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Notes (max 7 words)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-md"
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                {formData.notes.trim().split(/\s+/).filter(Boolean).length}/7 words
              </p>
            </div>

            <button
  type="submit"
  className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700"
  disabled={loading}
>
  {loading ? (editId ? "Updating..." : "Saving...") : editId ? "Update Sale" : "Record Sale"}
</button>

          </form>
        </div>
      </div>

      {/* Table */}
      <div className="lg:col-span-2">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>

          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-gray-50">
    <tr>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Customer</th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contact</th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Address</th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Notes</th>
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-200">
    {sales.length === 0 ? (
      <tr>
        <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
          No sales recorded yet.
        </td>
      </tr>
    ) : (
      currentSales.map((sale) => (
        <tr key={sale.id} className="hover:bg-gray-50">
          {/* Customer Name */}
          <td className="px-4 py-4 whitespace-nowrap font-medium">{sale.customer_name}</td>

          {/* Customer Contact */}
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.customer_contact}</td>

          {/* Delivery Address */}
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.delivery_address}</td>

          {/* Product & Quantity */}
          <td className="px-4 py-4 whitespace-nowrap capitalize">{sale.product_type} ({sale.quantity} kg)</td>

          {/* Amount */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="font-medium">
              /= {sale.total_amount || (sale.quantity * sale.price_per_kg + sale.delivery_cost)}
            </div>
            <div className="text-sm text-gray-500">
              /= {sale.price_per_kg}/kg + delivery
            </div>
          </td>

          {/* Date */}
          <td className="px-4 py-4 whitespace-nowrap">{new Date(sale.date || sale.created_at).toLocaleDateString()}</td>

          {/* Notes */}
          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{sale.notes || "N/A"}</td>

          {/* Actions */}
          <td className="px-4 py-4 whitespace-nowrap">
            <div className="flex gap-2">
              <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => handleEdit(sale)}>Edit</button>
              <button className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(sale.id)}>Delete</button>
            </div>
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
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === i + 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sales
