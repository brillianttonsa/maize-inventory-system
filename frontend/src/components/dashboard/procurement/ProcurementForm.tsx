import type { ChangeEvent, FormEvent } from 'react';
import { SaveOrUpdateBtn } from '../common/SaveOrUpdateBtn';
import {
  inputClass,
  labelClass,
  errorClass,
  formDivClass,
  headerFormClass,
  gridInputClass,
} from '../common/cssCommon';

interface ProcurementFormProps {
  formData: {
    supplier: string;
    supplierLocation: string;
    supplierPhone: string;
    quantityTons: string;
    maizePurchaseCost: string;
    transportCost: string;
    collectionLabour: string;
    loadingLabour: string;
    unloadingLabour: string;
    transportTax: string;
    ruralTax: string;
    deliveryDate: string;
  };
  editId: string | null;
  handleSaveOrUpdate: (e: FormEvent) => void;
  handleCancelEdit: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  saving: boolean;
}

const ProcurementForm = ({
  formData,
  editId,
  handleSaveOrUpdate,
  handleCancelEdit,
  handleChange,
  error,
  saving,
}: ProcurementFormProps) => {
  return (
    <div className={formDivClass}>
      <h3 className={headerFormClass}>{editId ? 'Edit Order' : 'Record New Maize Order'}</h3>

      <form onSubmit={handleSaveOrUpdate}>
        <div className="mb-4">
          <label className={labelClass}>Supplier</label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div className={gridInputClass}>
          <div><label className={labelClass}>Location</label><input type="text" name="supplierLocation" value={formData.supplierLocation} onChange={handleChange} className={inputClass} required /></div>
          <div><label className={labelClass}>Phone number</label><input type="tel" name="supplierPhone" value={formData.supplierPhone} onChange={handleChange} className={inputClass} required /></div>
        </div>

        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>Quantity (tons)</label>
            <input
              type="number"
              name="quantityTons"
              value={formData.quantityTons}
              min="0.01"
              step="0.01"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Actual maize purchase amount (/=)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              name="maizePurchaseCost"
              value={formData.maizePurchaseCost}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className={gridInputClass}>
          <div><label className={labelClass}>Collection labour (/=)</label><input type="number" min="0" name="collectionLabour" value={formData.collectionLabour} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Loading labour (/=)</label><input type="number" min="0" name="loadingLabour" value={formData.loadingLabour} onChange={handleChange} className={inputClass} /></div>
        </div>
        <div className={gridInputClass}>
          <div><label className={labelClass}>Unloading labour (/=)</label><input type="number" min="0" name="unloadingLabour" value={formData.unloadingLabour} onChange={handleChange} className={inputClass} /></div>
          <div><label className={labelClass}>Transport tax (/=)</label><input type="number" min="0" name="transportTax" value={formData.transportTax} onChange={handleChange} className={inputClass} /></div>
        </div>

        <div className={gridInputClass}>
          <div><label className={labelClass}>Rural tax (/=)</label><input type="number" min="0" name="ruralTax" value={formData.ruralTax} onChange={handleChange} className={inputClass} /></div>

          <div>
            <label className={labelClass}>Transport Cost (/=)</label>
            <input
              type="number"
              min="0"
              step="50"
              name="transportCost"
              value={formData.transportCost}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>
        <div>
        <label className={labelClass}>Procurement Date</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

        {error && <p className={errorClass}>{error}</p>}

        <SaveOrUpdateBtn editId={editId} handleCancelEdit={handleCancelEdit} saving={saving} type="Order" />
      </form>
    </div>
  );
};

export default ProcurementForm;
