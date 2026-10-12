import type { ChangeEvent, FormEvent } from 'react';
import { SaveOrUpdateBtn } from '../common/SaveOrUpdateBtn';
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

interface ProcurementFormProps {
  formData: {
    supplier: string;
    quantityTons: string;
    pricePerKg: string;
    transportCost: string;
    deliveryDate: string;
  };
  editId: string | null;
  handleSaveOrUpdate: (e: FormEvent) => void;
  handleCancelEdit: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  saving: boolean;
  totalCost: number;
}

const ProcurementForm = ({
  formData,
  editId,
  handleSaveOrUpdate,
  handleCancelEdit,
  handleChange,
  error,
  saving,
  totalCost,
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
          <div>
            <label className={labelClass}>Quantity (tons)</label>
            <input
              type="number"
              name="quantityTons"
              value={formData.quantityTons}
              step="0.01"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Price per kg (/=)</label>
            <input
              type="number"
              step="1"
              name="pricePerKg"
              value={formData.pricePerKg}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>Transport Cost (/=)</label>
            <input
              type="number"
              step="50"
              name="transportCost"
              value={formData.transportCost}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Delivery Date</label>
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

        <div className={totalCostDivClass}>
          <h4 className={h4TotalClass}>TOTAL COST: {totalCost.toLocaleString()}/=</h4>
        </div>

        {error && <p className={errorClass}>{error}</p>}

        <SaveOrUpdateBtn editId={editId} handleCancelEdit={handleCancelEdit} saving={saving} type="Order" />
      </form>
    </div>
  );
};

export default ProcurementForm;
