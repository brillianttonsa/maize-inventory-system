import { RenderUnitInput } from './RenderUnitInput';
import { CATEGORIES } from './constants';
import { errorClass, formDivClass, headerFormClass, inputClass, labelClass } from '../../common/cssCommon';
import { SaveOrUpdateBtn } from '../../common/SaveOrUpdateBtn';
const PAYMENT_METHODS = ['Cash', 'Mobile Money', 'Bank Transfer'];

const ExpenseForm = ({ 
    formData, 
    editId,
    handleSaveOrUpdate,
    handleCancelEdit,
    handleChange,
    wordCount,
    error,
    saving
}) => {
    


    return (
        <div className="lg:col-span-1 order-1 lg:order-2">
            <div className={formDivClass}>
                <h3 className={headerFormClass}>
                    {editId ? "Edit Expense Record" : "Record New Expense"}
                </h3>
                <form onSubmit={handleSaveOrUpdate} className="space-y-4">
                    
                    {/* Date */}
                    <div>
                        <label className={labelClass}>Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
                    </div>

                    {/* Category */}
                    <div>
                        <label className={labelClass}>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange} className={inputClass} required>
                            <option value="" disabled>Select Category</option>
                            {CATEGORIES.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* DYNAMIC UNIT INPUT FIELD */}
                    <RenderUnitInput
                        formData={formData}
                        handleChange={handleChange}
                    />

                    {/* Amount */}
                    <div>
                        <label className={labelClass}>Amount (TSh)</label>
                        <input type="number" step="1" name="amount" value={formData.amount} onChange={handleChange} placeholder="e.g., 50000" className={inputClass} required />
                    </div>
                    
                    {/* Paid By & Method (Omitted for brevity, assuming they are unchanged) */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Paid By */}
                        <div>
                            <label className={labelClass}>Paid By (Payer Name)</label>
                            <input type="text" name="paidBy" value={formData.paidBy} onChange={handleChange} placeholder="e.g., John Doe" className={inputClass} required />
                        </div>
                        {/* Method */}
                        <div>
                            <label className={labelClass}>Payment Method</label>
                            <select name="method" value={formData.method} onChange={handleChange} className={inputClass} required>
                                <option value="" disabled>Select Method</option>
                                {PAYMENT_METHODS.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* notes */}
                    <div>
                        <label className={labelClass}>notes (Max 3 words)</label>
                        <input type="text" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Weekly wages" className={`${inputClass}`} required />
                        <p className={`text-xs mt-1`}>
                                 {wordCount}/3 words (Max)
                        </p>
                    </div>
                    {error && <p className={errorClass}>{error}</p>}

                    {/* Submit/Cancel Buttons (omitted for brevity) */}
                    <SaveOrUpdateBtn
                        editId={editId}
                        handleCancelEdit={handleCancelEdit}
                        saving={saving}
                        type={"sale"}
                    />
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;