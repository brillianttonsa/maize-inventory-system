import type { ChangeEvent, FormEvent } from 'react';
import { inputClass, formDivClass, labelClass, errorClass, headerFormClass, gridInputClass } from '../common/cssCommon';
import { SaveOrUpdateBtn } from '../common/SaveOrUpdateBtn';

interface ProductionFormProps {
  editId: string | null;
  formData: {
    date: string;
    maizeTons: string;
    flourSacks5kg: string;
    flourSacks10kg: string;
    flourSacks25kg: string;
    branUnitCount: string;
  };
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSaveOrUpdate: (e: FormEvent) => void;
  handleCancelEdit: () => void;
  error: string | null;
  saving: boolean;
}

const ProductionForm = ({
  editId,
  formData,
  handleChange,
  handleSaveOrUpdate,
  handleCancelEdit,
  error,
  saving,
}: ProductionFormProps) => {
  return (
    <div className={formDivClass}>
      <h3 className={headerFormClass}>{editId ? 'Edit Production Batch' : 'Record New Production'}</h3>

      <form onSubmit={handleSaveOrUpdate}>
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
            <label className={labelClass}>Maize Input (tons)</label>
            <input
              type="number"
              name="maizeTons"
              value={formData.maizeTons}
              step="0.01"
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Bran Output</label>
            <input type="number" step="any" min="0" name="branUnitCount" value={formData.branUnitCount} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        <div className={gridInputClass}>
          
        </div>

        <div className={gridInputClass}>
          <div>
            <label className={labelClass}>Flour 5 kg sacks</label>
            <input type="number" min="0" name="flourSacks5kg" value={formData.flourSacks5kg} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Flour 10 kg sacks</label>
            <input type="number" min="0" name="flourSacks10kg" value={formData.flourSacks10kg} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Flour 25 kg sacks</label>
            <input type="number" min="0" name="flourSacks25kg" value={formData.flourSacks25kg} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {error && <p className={errorClass}>{error}</p>}

        <SaveOrUpdateBtn editId={editId} handleCancelEdit={handleCancelEdit} saving={saving} type="Batch" />
      </form>
    </div>
  );
};

export default ProductionForm;
