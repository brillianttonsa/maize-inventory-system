import { Filter } from 'lucide-react';
import { CATEGORIES, CATEGORY_COLORS } from './constants';
import { EXPENSE_HEADERS, expenseDataMapper } from '../../data/CSVData';
import TablePagination from '../../common/TablePagination';
import TableActions from '../../common/TableActions';
import {tableDiv2Class, thClass} from "../../common/cssCommon"
import ExportCSVButton from '../../common/ExportCSVButton';


const getUnitDisplay = (expense) => {
    if (!expense.unit_value) return "";

    const category = expense.category.toLowerCase();
    let unitText = '';

    if (category.includes('water')) {
        unitText = 'Litres';
    } else if (category.includes('sack')) {
        unitText = 'Sacks';
    } else if (category.includes('electricity')) {
        unitText = 'Units';
    }
    
    if (unitText) {
        return `${expense.unit_value} ${unitText}`;
    }
    return "";
};



const ExpenseTable = ({
    expenses, 
    currentExpenses, 
    filterCategory,
    setFilterCategory,
    indexOfFirst,
    handleDelete,
    handleEdit,
    currentPage,
    totalPages,
    paginate,
    loading
}) => {
    

    return (
        <section className="mt-8 p-4 sm:p-6 rounded-xl shadow-lg bg-white border border-yellow-200">
            <h2 className={"text-xl font-bold mb-4 text-yellow-700"}>
                Expense Record Table
            </h2>
            
            {/* Filter and Export Row */}
            <div className='flex flex-wrap items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4 mb-4'>
                <div className='flex items-center space-x-4'>
                    <Filter className='h-5 w-5 text-gray-500' />
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Category:</label>
                    <select 
                        value={filterCategory} 
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className={"w-full sm:w-auto px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white border-gray-300"}
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>

                {/* Export Button */}
                <ExportCSVButton
                    data={expenses}
                    filename={"expenses"}
                    headers={EXPENSE_HEADERS}
                    dataMapper={expenseDataMapper}
                    disabled={expenses.length === 0}
                />
            </div>

            {/* Table Container */}
            <div className={tableDiv2Class}>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-yellow-100">
                        <tr>
                            {/* Updated Headers: Added Quantity/Unit */}
                            {["S/N","Date", "Category", "Quantity/Unit", "Amount (TSh)", "Paid By", "Method", "Description", "Action"].map(header => (
                                <th key={header} className={thClass}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
                        {loading ? (
                            <tr>
                            <td colSpan="7" className="px-4 py-4 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : expenses.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                            No expenses recorded yet.
                            </td>
                        </tr>
                        ) : (currentExpenses.map((expense, index) => {
                            
                            
                            return (
                                <tr key={expense.id} className="hover:bg-yellow-50/50 transition-colors">
                                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {indexOfFirst + index + 1}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{expense.date}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-yellow-700">
                                        <span className='px-2 py-1 text-xs rounded-full' style={{backgroundColor: CATEGORY_COLORS[expense.category] + '33', color: CATEGORY_COLORS[expense.category]}}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    {/* NEW: Display Quantity/Unit */}
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">
                                        {getUnitDisplay(expense) || "-"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">{(expense.amount).toLocaleString()}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{expense.paid_by}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">{expense.method}</td>
                                    <td className="px-4 py-3 text-sm max-w-xs">{expense.notes}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        <TableActions
                                            item={expense}
                                            handleEdit={handleEdit}
                                            handleDelete={handleDelete}
                                        />
                                    </td>
                                </tr>
                            );
                        }))}
                    </tbody>
                </table>
                
            </div>

            {/* Pagination Controls */}
            <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            />
        </section>
    );
};

export default ExpenseTable;
