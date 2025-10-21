
import { Download } from "lucide-react"
import TablePagination from "./TablePagination" 
import TableActions from "./TableActions"        

const OrdersTable = ({
    orders,           
    currentOrders,    
    indexOfFirst, 
    handleEdit, 
    handleDelete, 
    currentPage, 
    totalPages, 
    paginate 
}) => {

  const handleExportCsv = () => {
    // ... (CSV logic ) ...
    if (orders.length === 0) {
        alert("No data to export!");
        return;
    }

    const headers = [
        "ID", "Supplier", "Quantity (kg)", "Price per kg", "Transport Cost", 
        "Total Cost", "Delivery Date", "Notes"
    ];

    const csvRows = orders.map(order => [
        order.id,
        `"${order.supplier.replace(/"/g, '""')}"`,
        order.quantity,
        order.price_per_kg || order.pricePerKg,
        order.transport_cost || order.transportCost,
        order.total_cost || order.totalCost,
        new Date(order.delivery_date || order.deliveryDate).toLocaleDateString(),
        `"${(order.notes || '').replace(/"/g, '""')}"`
    ].join(','));

    const csvContent = [
        headers.join(','),
        ...csvRows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `procurement_orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="p-6 rounded-lg shadow-xl bg-white">
      {/* Table Header with Title and Export Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-500">Recent Orders</h3>
        <button 
          onClick={handleExportCsv} 
          className="flex items-center space-x-2 py-1.5 px-4 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm"
          disabled={orders.length === 0}
        >
          <Download className="h-4 w-4" />
          <span>Export All</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {/* ... (Header row) ... */}
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Supplier</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Quantity / Price</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Transport Cost</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Total Cost</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Delivery Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Notes</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap font-medium">{indexOfFirst + index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium">{order.supplier}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col">
                      <span>{order.quantity} kg</span>
                      <span className="text-xs text-gray-500">@{order.price_per_kg || order.pricePerKg}/=</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">{order.transport_cost || order.transportCost}/=</td>
                  <td className="px-4 py-4 whitespace-nowrap font-bold text-right">{order.total_cost || order.totalCost}/=</td>
                  <td className="px-4 py-4 whitespace-nowrap">{new Date(order.delivery_date || order.deliveryDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 max-w-xs overflow-hidden text-ellipsis">{order.notes || "N/A"}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <TableActions 
                        order={order} 
                        handleEdit={handleEdit} 
                        handleDelete={handleDelete} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination component */}
      <TablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  )
}

export default OrdersTable