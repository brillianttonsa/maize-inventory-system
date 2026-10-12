import type { ChangeEvent, FormEvent } from 'react';
import {
  inputClass,
  labelClass,
  errorClass,
  formDivClass,
  headerFormClass,
  gridInputClass,
  totalCostDivClass,
  h4TotalClass,
} from '../common/cssCommon';
import { SaveOrUpdateBtn } from '../common/SaveOrUpdateBtn';

interface SalesFormProps {
  formData: {
    customerName: string;
    customerContact: string;
    date: string;
    productType: string;
    quantity: string;
    sackCount: string;
    sackSize: string;
    branUnitCount: string;
    branUnit: 'gunia';
    pricePerKg: string;
    deliveryCost: string;
    deliveryAddress: string;
    paymentMethod: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSaveOrUpdate: (e: FormEvent) => void;
  editId: string | null;
  error: string | null;
  handleCancelEdit: () => void;
  saving: boolean;
  totalCost: number;
}

const SalesForm = ({
  formData,
  handleChange,
  handleSaveOrUpdate,
  editId,
  error,
  handleCancelEdit,
  saving,
  totalCost,
}: SalesFormProps) => {
  return (
    <div className={formDivClass}>
      <h3 className={headerFormClass}>{editId ? 'Edit Sale' : 'Record New Sale'}</h3>

      <form onSubmit={handleSaveOrUpdate}>
        <div className="mb-4">
          <label className={labelClass}>Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Customer Contact</label>
          <input
            type="tel"
            name="customerContact"
            value={formData.customerContact}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

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

        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>Product Type</label>
            <select
              name="productType"
              value={formData.productType}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="flour">Flour</option>
              <option value="bran">Bran</option>
            </select>
          </div>

          {formData.productType === 'bran' ? (
            <div>
              <label className={labelClass}>Bran Quantity</label>
              <input type="number" min="0.01" step="any" name="branUnitCount" value={formData.branUnitCount} onChange={handleChange} className={inputClass} required />
            </div>
          ) : (
          <div>
            <label className={labelClass}>Number of Sacks</label>
            <input type="number" min="1" name="sackCount" value={formData.sackCount} onChange={handleChange} className={inputClass} required />
          </div>
          )}
        </div>

        <div className={gridInputClass}>
          {formData.productType === 'bran' ? (
            <div>
              <label className={labelClass}>Bran Unit</label>
              <input value="Gunia (7 debe)" className={inputClass} disabled />
            </div>
          ) : (
          <div>
            <label className={labelClass}>Sack Size</label>
            <select name="sackSize" value={formData.sackSize} onChange={handleChange} className={inputClass} required>
              <option value="" disabled>Select size</option>
              <option value="5">5 kg</option>
              <option value="10">10 kg</option>
              <option value="25">25 kg</option>
            </select>
          </div>
          )}
          <div>
            <label className={labelClass}>{formData.productType === 'bran' ? 'Price per selected unit (/=)' : 'Price per kg (/=)'}</label>
            <input
              type="number"
              step="0.01"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Delivery Cost (/=)</label>
            <input
              type="number"
              step="0.01"
              name="deliveryCost"
              value={formData.deliveryCost}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <p className="mb-4 text-sm text-gray-600">{formData.productType === 'bran' ? <>Total quantity: <strong>{Number(formData.branUnitCount || 0) * 7} debe</strong></> : <>Total quantity: <strong>{Number(formData.sackCount || 0) * Number(formData.sackSize || 0)} kg</strong></>}</p>

        <div className={totalCostDivClass}>
          <h4 className={h4TotalClass}>TOTAL AMOUNT: {totalCost.toLocaleString()}/=</h4>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Delivery Address</label>
          <input
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
            className={inputClass}
            maxLength={20}
          />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile_money">Mobile Money</option>
          </select>
        </div>


        {error && <p className={errorClass}>{error}</p>}

        <SaveOrUpdateBtn editId={editId} handleCancelEdit={handleCancelEdit} saving={saving} type="Sale" />
      </form>
    </div>
  );
};

export default SalesForm;
