import { Download } from 'lucide-react';
import Pagination from '../../common/Pagination'; 
import TableActions from '../../common/TableActions'; 

const SalesTable = ({ 
  allSales, 
  currentSales, 
  loading, 
  indexOfFirst, 
  totalPages, 
  currentPage, 
  setCurrentPage, 
  handleDelete, 
  handleEdit, 
  handleExportCSV 
}) => {
  return (
    <div className="lg:col-span-2">
      <div className="p-6 rounded-lg shadow-lg bg-white border border-yellow-200">
        
        {/* Header and Export Button */}
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-yellow-700">Recent Sales</h3>
            <button 
                onClick={() => handleExportCSV(allSales)} 
                className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-md"
                disabled={loading || allSales.length === 0}
            >
                <Download className="h-4 w-4" />
                Export CSV
            </button>
        </div>

        {/* Table Container with yellow theme */}
        <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-yellow-100"> 
              <tr>
                {["Customer", "Product (Qty)", "Address", "Amount", "Payment", "Date", "Action"].map(header => (
                    <th key={header} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-700 whitespace-nowrap">
                        {header}
                    </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
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
                  const quantity = Number(sale.quantity) || 0;
                  const pricePerKg = Number(sale.price_per_kg) || 0;
                  const deliveryCost = Number(sale.delivery_cost) || 0;
                  const totalAmount = (quantity * pricePerKg + deliveryCost).toFixed(2);
                  
                  return (
                    <tr key={sale.id} className="hover:bg-yellow-50/50 transition-colors">
                      {/* Customer */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{sale.customer_name}</div>
                        <div className="text-sm text-gray-500">{sale.customer_contact}</div>
                      </td>

                      {/* Product (Qty) */}
                      <td className="px-4 py-4 whitespace-nowrap capitalize">
                        {sale.product_type} ({sale.quantity} kg)
                        <div className="text-sm text-gray-500">{sale.price_per_kg}/= per kg</div>
                      </td>
                      
                      {/* Address */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{sale.delivery_address}</td>

                      {/* Amount (Highlighting financial success in Green) */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-bold text-green-700">{totalAmount}/=</div>
                        <div className="text-sm text-gray-500">Deliv: {sale.delivery_cost}/=</div>
                      </td>

                      {/* Payment */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {sale.payment_method}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(sale.date || sale.created_at).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <TableActions batch={sale} handleEdit={handleEdit} handleDelete={handleDelete} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
};

export default SalesTable;