

const SalesForm = ({ formData, handleChange, handleSaveOrUpdate, editId, handleCancelEdit, saving }) => {
  const totalAmount = (Number(formData.quantity) * Number(formData.pricePerKg) + Number(formData.deliveryCost)) || 0;
  const notesWordCount = formData.notes.trim().split(/\s+/).filter(Boolean).length;
  
  // Shared input classes with Yellow focus ring
  const inputClass = "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white border-gray-300 focus:outline-none";
  
  return (
    <div className="lg:col-span-1">
      <div className="p-6 rounded-lg shadow-lg bg-white border border-yellow-200">
        <h3 className="text-lg font-bold mb-4 text-yellow-700">
            {editId ? "Edit Sale" : "Record Sale"}
        </h3>

        <form onSubmit={handleSaveOrUpdate}>
          
          {/* Inputs using yellow focus styling */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Customer Name</label>
            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Customer Contact</label>
            <input type="tel" name="customerContact" value={formData.customerContact} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Product Type</label>
              <select name="productType" value={formData.productType} onChange={handleChange} className={inputClass}>
                <option value="flour">Flour</option>
                <option value="bran">Bran</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Quantity (kg)</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Price per kg (/=)</label>
              <input type="number" step="0.01" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Delivery Cost (/=)</label>
              <input type="number" step="0.01" name="deliveryCost" value={formData.deliveryCost} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          
          {/* Total Calculation Display (Success Green) */}
          <div className="mb-4 p-3 bg-green-50 rounded-md text-center border border-green-200">
            <h4 className="text-md font-bold text-green-700">TOTAL AMOUNT: {totalAmount.toFixed(2)}/=</h4>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Delivery Address</label>
            <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required className={inputClass} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputClass}>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">Notes (max 5 words)</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className={inputClass}></textarea>
            <p className="text-sm text-gray-500 mt-1">{notesWordCount}/5 words</p>
          </div>

          {/* Conditional Buttons */}
          {editId ? (
            <div className="flex gap-4">
              {/* Cancel Button - Neutral Color */}
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="w-full py-2 px-4 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                Cancel Edit
              </button>
              {/* Update Button - Secondary Blue Color */}
              <button 
                type="submit" 
                className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Sale"}
              </button>
            </div>
          ) : (
            // Record Button - Primary Yellow Color
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition-colors"
              disabled={saving}
            >
              {saving ? "Saving..." : "Record Sale"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SalesForm;