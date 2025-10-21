
import { useMemo } from 'react';

const ProcurementForm = ({ 
    formData, 
    setFormData, 
    editId, 
    handleSubmit, 
    handleCancelEdit 
}) => {

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "notes") {
      const words = value.trim().split(/\s+/).filter(Boolean)
      if (words.length > 3 && value.length > formData.notes.length) return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  
  const wordCount = useMemo(() => 
    formData.notes.trim().split(/\s+/).filter(Boolean).length, 
    [formData.notes]
  )

  return (
    <div className="p-6 rounded-lg shadow-xl bg-white">
      <h3 className="text-xl font-bold mb-6 text-yellow-500">
        {editId ? "Edit Order" : "New Maize Order"}
      </h3>
      <form onSubmit={handleSubmit}>
        {/* Supplier */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Supplier</label>
          <input type="text" name="supplier" value={formData.supplier} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white border-gray-300" required />
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Quantity (kg)</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white border-gray-300" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Price per kg (/=)</label>
            <input type="number" step="0.01" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white border-gray-300" required />
          </div>
        </div>

        {/* Transport & Delivery */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Transport Cost (/=)</label>
            <input type="number" step="0.01" name="transportCost" value={formData.transportCost} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white border-gray-300" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Delivery Date</label>
            <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white border-gray-300" required />
          </div>
        </div>

      
        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white border-gray-300"></textarea>
          <p className={`text-xs mt-1 ${wordCount > 3 ? 'text-red-500' : "text-gray-500"}`}>
            {wordCount}/3 words (Max)
          </p>
        </div>

        {/* Submit/Cancel Buttons */}
        <div className="flex space-x-3">
          {editId && (
            <button type="button" onClick={handleCancelEdit} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-100">
              Cancel
            </button>
          )}
          <button type="submit" className={`flex-1 py-2 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${editId ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" : "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"}`}>
            {editId ? "Update Order" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProcurementForm