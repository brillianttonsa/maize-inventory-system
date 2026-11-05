import type { ChangeEvent, FormEvent } from 'react';
import {
  inputClass,
  labelClass,
  errorClass,
  formDivClass,
  headerFormClass,
  gridInputClass,
} from '../common/cssCommon';
import { SaveOrUpdateBtn } from '../common/SaveOrUpdateBtn';

interface SalesFormProps {
  formData: {
    customerName: string;
    customerContact: string;
    date: string;
    productType: string;
    sackCount: string;
    sackSize: string;
    pricePerSack: string;
    deliveryCost: string;
    deliveryAddress: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSaveOrUpdate: (e: FormEvent) => void;
  editId: string | null;
  error: string | null;
  handleCancelEdit: () => void;
  saving: boolean;
}

const SalesForm = ({
  formData,
  handleChange,
  handleSaveOrUpdate,
  editId,
  error,
  handleCancelEdit,
  saving,
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
              <label className={labelClass}>Number of Bran Sacks</label>
              <input type="number" min="1" step="1" name="sackCount" value={formData.sackCount} onChange={handleChange} className={inputClass} required />
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
              <label className={labelClass}>Sack Size</label>
              <input value="Bran sack" className={inputClass} disabled />
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
            <label className={labelClass}>Price per sack (/=)</label>
            <input
              type="number"
              step="0.01"
              name="pricePerSack"
              value={formData.pricePerSack}
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

        {error && <p className={errorClass}>{error}</p>}

        <SaveOrUpdateBtn editId={editId} handleCancelEdit={handleCancelEdit} saving={saving} type="Sale" />
      </form>
    </div>
  );
};

export default SalesForm;
