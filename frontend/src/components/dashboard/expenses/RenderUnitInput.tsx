import { labelClass, inputClass } from '../common/cssCommon';

interface RenderUnitInputProps {
  formData: { category: string; unitValue: string; unitCost: string; sackSize: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const RenderUnitInput = ({ formData, handleChange }: RenderUnitInputProps) => {
  const category = formData.category;
  let unitName = '';
  let labelText = '';

  if (category.toLowerCase().includes('water')) {
    unitName = 'litres';
    labelText = 'Litres Consumed';
  } else if (category.toLowerCase().includes('sacks')) {
    unitName = 'sacks';
    labelText = 'Number of Sacks';
  } else if (category.toLowerCase().includes('electricity')) {
    unitName = 'units';
    labelText = 'Electricity Units (kWh)';
  }

  if (unitName) {
    return (
      <div>
        <label className={labelClass}>{labelText}</label>

        <input
          type="number"
          step="any"
          name="unitValue"
          value={formData.unitValue}
          onChange={handleChange}
          placeholder={`Enter ${unitName}`}
          className={inputClass}
          required
        />
        {category.toLowerCase().includes('sacks') && (
          <div className="mt-4">
            <label className={labelClass}>Sack Size</label>
            <select
              name="sackSize"
              value={formData.sackSize}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" disabled>Select sack size</option>
              <option value="5">5 kg</option>
              <option value="10">10 kg</option>
              <option value="25">25 kg</option>
            </select>
          </div>
        )}
        {(category.toLowerCase().includes('sacks') || category.toLowerCase().includes('water')) && (
          <div className="mt-4">
            <label className={labelClass}>
              {category.toLowerCase().includes('sacks') ? 'Cost per Sack (TSh)' : 'Cost per Litre (TSh)'}
            </label>
            <input type="number" min="0" step="0.01" name="unitCost" value={formData.unitCost} onChange={handleChange} className={inputClass} required />
          </div>
        )}
      </div>
    );
  }
  return null;
};
