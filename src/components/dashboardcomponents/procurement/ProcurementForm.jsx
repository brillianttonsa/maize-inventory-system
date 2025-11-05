import { SaveOrUpdateBtn } from "../../common/SaveOrUpdateBtn";
import { inputClass, labelClass, errorClass, formDivClass, headerFormClass, gridInputClass, totalCostDivClass, h4TotalClass } from "../../common/cssCommon";

// form component
const ProcurementForm = ({
  formData,
  editId,
  handleSaveOrUpdate,
  handleCancelEdit,
  handleChange,
  wordCount,
  error,
  saving,
  totalCost
}) => {
 

   return (
    <div className={formDivClass}>
      <h3 className={headerFormClass}>
        {editId ? "Edit Order" : "Record New Maize Order"}
      </h3>

      <form onSubmit={handleSaveOrUpdate}>
        {/* Supplier */}
        <div className="mb-4">
          <label className={labelClass}>
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
        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>
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
            <label className={labelClass}>
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
        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>
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
            <label className={labelClass}>
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
        <div className={totalCostDivClass}>
            <h4 className={h4TotalClass}>TOTAL COST: {totalCost}/=</h4>
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className={labelClass}>
            Notes
          </label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            required
            className={inputClass}
          ></input>
          <p
            className="text-xs mt-1"
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
          type={"Order"}
        />
      </form>
    </div>
  );
};

export default ProcurementForm;
