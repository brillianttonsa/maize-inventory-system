import { labelClass, inputClass } from "../../common/cssCommon";
export const RenderUnitInput = ({formData, handleChange}) => {
    const category = formData.category;
    let unitName = '';
    let labelText = '';

    // Check the category and set the unit details
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
            </div>
        );
    }
    return null;
}