// form component
const ProcurementForm = ({
  formData,
  editId,
  handleSaveOrUpdate,
  handleCancelEdit,
  handleChange,
  wordCount,
  error,
  saving
}) => {
 
  const totalAmount = (Number(formData.quantity) * Number(formData.pricePerKg) + Number(formData.transportCost)) || 0;

  // Standardized input class
  const inputClass =
    "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white border-gray-300 outline-none";

  return (
    <div className="p-6 rounded-lg shadow-lg bg-white border border-yellow-200">
      <h3 className="text-xl font-bold mb-6 text-yellow-700">
        {editId ? "Edit Order" : "New Maize Order"}
      </h3>

      <form onSubmit={handleSaveOrUpdate}>
        {/* Supplier */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Supplier
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* Quantity & Price */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Quantity (kg)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Price per kg (/=)
            </label>
            <input
              type="number"
              step="0.01"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Transport & Delivery */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Transport Cost (/=)
            </label>
            <input
              type="number"
              step="0.01"
              name="transportCost"
              value={formData.transportCost}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Delivery Date
            </label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

      {/* total cost display */}
        <div className="mb-4 p-3 bg-green-50 rounded-md text-center border border-green-200">
            <h4 className="text-md font-bold text-green-700">TOTAL COST: {totalAmount.toFixed(2)}/=</h4>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className={inputClass}
          ></textarea>
          <p
            className="text-xs mt-1"
          >
            {wordCount}/3 words (Max)
          </p>
        </div>
        {error && <p className="text-sm text-red-400 font-bold bg-red-200 border rounded text-center mb-2 p-2">{error}</p>}

        {/* Conditional Buttons */}
        {editId ? (
            <div className="flex gap-4">
              {/* Cancel Button */}
              <button 
                type="button" 
                onClick={handleCancelEdit}
                className="w-full py-2 px-4 bg-gray-500 text-white font-medium rounded-md hover:bg-gray-600 transition-colors"
                disabled={saving}
              >
                Cancel Edit
              </button>
              {/* Update Button */}
              <button 
                type="submit" 
                className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Sale"}
              </button>
            </div>
          ) : (
            // Record Button 
            <button
              type="submit"
              className="w-full py-2 px-4 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 transition-colors"
              disabled={saving}
            >
              {saving ? "Saving..." : "Place Order"}
            </button>
          )}
      </form>
    </div>
  );
};

export default ProcurementForm;
