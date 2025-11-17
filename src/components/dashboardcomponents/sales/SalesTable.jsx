import TablePagination from '../../common/TablePagination';
import TableActions from '../../common/TableActions';
import ExportCSVButton from '../../common/ExportCSVButton'; 
import { SALES_HEADERS, salesDataMapper } from "../../data/CSVData";
import { tableDiv2Class, tableDivClass, thClass } from '../../common/cssCommon';

const SalesTable = ({ 
  sales, 
  currentSales, 
  indexOfFirst, 
  totalPages, 
  currentPage, 
  handleDelete, 
  handleEdit, 
  loading,
  paginate
}) => {
  return (
    <div className={tableDivClass}>
      
      {/* Header and Export Button */}
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-yellow-700">Recent Sales</h3>
          <ExportCSVButton
            data={sales}
            filename={"sales"}
            headers={SALES_HEADERS}
            dataMapper={salesDataMapper}
            disabled={sales.length === 0}
          />
      </div>

      {/* Table Container with yellow theme */}
      <div className={tableDiv2Class}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-100"> 
            <tr>
              {["S/N","Customer", "Product(Qty)", "Address","Delivery Cost", "Total Amount", "Payment", "Date","notes", "Action"].map(header => (
                  <th key={header} className={thClass}>
                      {header}
                  </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 ">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">Loading...</td>
              </tr>
            ) : currentSales.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">No sales recorded yet.</td>
              </tr>
            ) : (
              currentSales.map((sale, index) => {
                
                
                return (
                  <tr key={sale.id} className="hover:bg-yellow-50/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {indexOfFirst + index + 1}
                     </td> 
                    {/* Customer */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{sale.customer_name}</span>
                      <div className="text-sm text-gray-500 italic">{sale.customer_contact}</div>
                    </td>

                    {/* Product (Qty) */}
                    <td className="px-4 py-4 whitespace-nowrap capitalize">
                      {sale.product_type}: ({sale.quantity} kg)
                      <div className="text-sm text-gray-500">@{sale.price_per_kg}/=</div>
                    </td>
                    
                    {/* Address */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{sale.delivery_address}</td>
                  
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-700'>
                      {Number(sale.delivery_cost).toLocaleString()}
                    </td>

                    {/* Amount (Highlighting financial success in Green) */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-bold text-green-700">{Number(sale.total_amount).toLocaleString()}/=</div>
                    </td>

                    {/* Payment */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {sale.payment_method}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.date }
                    </td>

                    {/* notes */}
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {sale.notes}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <TableActions 
                        item={sale} 
                        handleEdit={handleEdit} 
                        handleDelete={handleDelete} 
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  );
};

export default SalesTable;