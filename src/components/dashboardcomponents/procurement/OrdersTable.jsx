import TablePagination from "./TablePagination";
import TableActions from "./TableActions";
import ExportCsvButton from "./ExportCsvButton";

const OrdersTable = ({
  orders,
  currentOrders,
  indexOfFirst,
  handleEdit,
  handleDelete,
  currentPage,
  totalPages,
  paginate,
}) => {
  
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white border border-yellow-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-700">Recent Orders</h3>
        <ExportCsvButton data={orders} filenamePrefix="procurement_orders" />
      </div>

      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 italic">
          <thead className="bg-yellow-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-700">
                No
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-700">
                Supplier
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-yellow-700">
                Quantity / Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-yellow-700">
                Transport Cost
              </th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-yellow-700">
                Total Cost
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-700">
                Delivery Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-700">
                Notes
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-yellow-50/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {order.supplier}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col">
                      <span className="font-semibold text-yellow-700">
                        {order.quantity} kg
                      </span>
                      <span className="text-xs text-gray-500">
                        @{order.price_per_kg || order.pricePerKg}/=
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-red-500">
                    {order.transport_cost || order.transportCost}/=
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-bold text-right text-green-600">
                    {order.total_cost || order.totalCost}/=
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                    {new Date(order.delivery_date || order.deliveryDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 max-w-xs overflow-hidden text-ellipsis text-gray-500">
                    {order.notes || "—"}
                  </td>
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

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  );
};

export default OrdersTable;
