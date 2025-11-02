

const ProductionForm = ({
  editId,
  formData,
  handleChange,
  handleSaveOrUpdate,
  handleCancelEdit,
  error,
  saving,
  wordCount
}) => {
  // Standardized input class
  const inputClass =
    "w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors bg-white border-gray-300 outline-none";

  
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white border border-yellow-200">
      <h3 className="text-xl font-bold mb-6 text-yellow-700">
        {editId ? "Edit Production Batch" : "Record Production"}
      </h3>
      
      <form onSubmit={handleSaveOrUpdate}> 
        
        {/* Date Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        {/* Maize & Flour */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Maize Input (kg)</label>
            <input type="number" name="maizeQuantity" value={formData.maizeQuantity} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Flour Output (kg)</label>
            <input type="number" name="flourOutput" value={formData.flourOutput} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        {/* Bran & Water */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Bran Output (kg)</label>
            <input type="number" name="branOutput" value={formData.branOutput} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Water Usage (L)</label>
            <input type="number" name="waterUsage" value={formData.waterUsage} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        {/* Electricity & Sacks */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Electricity (kWh)</label>
            <input type="number" name="electricityUsage" value={formData.electricityUsage} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Sacks Used</label>
            <input type="number" name="sacksUsed" value={formData.sacksUsed} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        {/* Employee Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">Employee Notes (max 3 words)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className={inputClass}
          ></textarea>
          <p
            className={`text-xs mt-1`}
          >
            {wordCount}/3 words (Max)
          </p>
        </div>
        w

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

export default ProductionForm;