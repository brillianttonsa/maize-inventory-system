import type { ChangeEvent, FormEvent } from 'react';
import { RenderUnitInput } from './RenderUnitInput';
import { CATEGORIES } from './constants';
import { errorClass, formDivClass, headerFormClass, inputClass, labelClass } from '../common/cssCommon';
import { SaveOrUpdateBtn } from '../common/SaveOrUpdateBtn';

interface ExpenseFormProps {
  formData: {
    date: string;
    category: string;
    totalAmount: string;
    unitValue: string;
    unitCost: string;
    sackSize: string;
    notes: string;
  };
  editId: string | null;
  handleSaveOrUpdate: (e: FormEvent) => void;
  handleCancelEdit: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  wordCount: number;
  error: string | null;
  saving: boolean;
}

const ExpenseForm = ({
  formData,
  editId,
  handleSaveOrUpdate,
  handleCancelEdit,
  handleChange,
  wordCount,
  error,
  saving,
}: ExpenseFormProps) => {
  return (
    <div className="lg:col-span-1 order-1 lg:order-2">
      <div className={formDivClass}>
        <h3 className={headerFormClass}>{editId ? 'Edit Expense Record' : 'Record New Expense'}</h3>
        <form onSubmit={handleSaveOrUpdate} className="space-y-4">
          <div>
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

          <div>
            <label className={labelClass}>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <RenderUnitInput formData={formData} handleChange={handleChange} />

          {!['sacks', 'water'].includes(formData.category.toLowerCase()) && <div>
            <label className={labelClass}>Total Amount (TSh)</label>
            <input
              type="number"
              step="1"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              placeholder="e.g., 50000"
              className={inputClass}
              required
            />
          </div>}

          <div>
            <label className={labelClass}>notes (Max 3 words)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g., Weekly wages"
              className={`${inputClass}`}
              required
            />
            <p className="text-xs mt-1">{wordCount}/3 words (Max)</p>
          </div>
          {error && <p className={errorClass}>{error}</p>}

          <SaveOrUpdateBtn editId={editId} handleCancelEdit={handleCancelEdit} saving={saving} type="expense" />
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
