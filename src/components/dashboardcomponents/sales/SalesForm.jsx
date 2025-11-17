import { inputClass, labelClass, errorClass, formDivClass, headerFormClass, gridInputClass, totalCostDivClass, h4TotalClass } from "../../common/cssCommon";
import { SaveOrUpdateBtn } from "../../common/SaveOrUpdateBtn";

// form component
const SalesForm = ({ 
  formData, 
  handleChange, 
  handleSaveOrUpdate, 
  editId, 
  error,
  wordCount,
  handleCancelEdit, 
  saving,
  totalCost 
  }) => {
  
  
    return (
      <div className={formDivClass}>
        <h3 className={headerFormClass}>
            {editId ? "Edit Sale" : "Record New Sale"}
        </h3>

        <form onSubmit={handleSaveOrUpdate}>
          {/* customer name */}
          <div className="mb-4">
            <label className={labelClass}>
              Customer Name
            </label>
            <input 
              type="text" 
              name="customerName" 
              value={formData.customerName} 
              onChange={handleChange} 
              className={inputClass} 
              required 
            />
          </div>

          {/* customer contact */}
          <div className="mb-4">
            <label className={labelClass}>Customer Contact</label>
            <input type="tel" name="customerContact" value={formData.customerContact} onChange={handleChange}  className={inputClass} required/>
          </div>

          {/* date */}
          <div className="mb-4">
            <label className={labelClass}>
              Date
            </label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
          </div>

          {/* product type */}
          <div className={gridInputClass}>
            <div>
              <label className={labelClass}>Product Type</label>
              <select name="productType" value={formData.productType} onChange={handleChange} className={inputClass} required>
                <option value="flour">Flour</option>
                <option value="bran">Bran</option>
              </select>
            </div>

            {/* quantity */}
            <div>
              <label className={labelClass}>Quantity (kg)</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className={inputClass} required/>
            </div>
          </div>

          {/* price for @ & delivery cost */}
          <div className={gridInputClass}>
            <div>
              <label className={labelClass}>Price per kg (/=)</label>
              <input type="number" step="0.01" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Delivery Cost (/=)</label>
              <input type="number" step="0.01" name="deliveryCost" value={formData.deliveryCost} onChange={handleChange} required className={inputClass} />
            </div>
          </div>
          
          {/* Total Calculation Display (Success Green) */}
          <div className={totalCostDivClass}>
            <h4 className={h4TotalClass}>TOTAL AMOUNT: {totalCost.toLocaleString()}/=</h4>
          </div>

          {/* address */}
          <div className="mb-4">
            <label className={labelClass}>Delivery Address</label>
            <input type="text" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} required className={inputClass} maxLength={20}/>
          </div>

          {/* payment method */}
          <div className="mb-4">
            <label className={labelClass}>Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className={inputClass}>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          {/* notes */}
          <div className="mb-6">
            <label className={labelClass}>Notes (max 3 words)</label>
            <input type="text" name="notes" value={formData.notes} onChange={handleChange} placeholder="eg. flour sold" className={inputClass} required/>
            <p className="text-sm text-gray-500 mt-1">{wordCount}/3 words</p>
          </div>

          {error && <p className={errorClass}>{error}</p>}

          {/* Conditional Buttons */}
          <SaveOrUpdateBtn
            editId={editId}
            handleCancelEdit={handleCancelEdit}
            saving={saving}
            type={"Sale"}
          />
        </form>
      </div>
    );
};

export default SalesForm;