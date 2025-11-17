import { inputClass, formDivClass, labelClass, errorClass, headerFormClass, gridInputClass } from "../../common/cssCommon";
import { SaveOrUpdateBtn } from "../../common/SaveOrUpdateBtn";

// form component
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
  
  
  return (
    <div className={formDivClass}>
      <h3 className={headerFormClass}>
        {editId ? "Edit Production Batch" : "Record New Production"}
      </h3>
      
      <form onSubmit={handleSaveOrUpdate}> 
        {/* Date Input */}
        <div className="mb-4">
          <label className={labelClass}>Date</label>
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
        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>Maize Input (kg)</label>
            <input type="number" name="maizeQuantity" value={formData.maizeQuantity} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Flour Output (kg)</label>
            <input type="number" name="flourOutput" value={formData.flourOutput} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        {/* Bran & Water */}
        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>Bran Output (kg)</label>
            <input type="number" name="branOutput" value={formData.branOutput} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Water Usage (L)</label>
            <input type="number" name="waterUsage" value={formData.waterUsage} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        {/* Electricity & Sacks */}
        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>Electricity (kWh)</label>
            <input type="number" name="electricityUsage" value={formData.electricityUsage} onChange={handleChange} className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>Sacks Used</label>
            <input type="number" name="sacksUsed" value={formData.sacksUsed} onChange={handleChange} className={inputClass} required />
          </div>
        </div>

        {/* Employee Notes */}
        <div className="mb-4">
          <label className={labelClass}>    Notes (max 3 words)</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="eg 'produced by tonsa'"
            className={`${inputClass} text-sm`} required
          />
          <p
            className={`text-xs mt-1`}
          >
            {wordCount}/3 words (Max)
          </p>
        </div>
        

        {error && <p className={errorClass}>{error}</p>}

        {/* Conditional Buttons */}
        <SaveOrUpdateBtn
          editId={editId}
          handleCancelEdit={handleCancelEdit}
          saving={saving}
          type={"Batch"}
        />
      </form>
    </div>
  );
};

export default ProductionForm;