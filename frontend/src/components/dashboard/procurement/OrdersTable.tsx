import TablePagination from '../common/TablePagination';
import TableActions from '../common/TableActions';
import ExportCSVButton from '../common/ExportCSVButton';
import { PROCUREMENT_HEADERS, procurementDataMapper } from '../../data/CSVData';
import { tableDiv2Class, tableDivClass, thClass } from '../common/cssCommon';
import type { ProcurementOrder } from '../../../types';
import { procurementService } from '../../../services/procurementApi';

interface OrdersTableProps {
  orders: ProcurementOrder[];
  currentOrders: ProcurementOrder[];
  indexOfFirst: number;
  handleEdit: (order: ProcurementOrder) => void;
  handleDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
  loading: boolean;
  totalRecords: number;
}

const OrdersTable = ({
  orders,
  currentOrders,
  indexOfFirst,
  handleEdit,
  handleDelete,
  currentPage,
  totalPages,
  paginate,
  loading,
  totalRecords,
}: OrdersTableProps) => {
  return (
    <div className={tableDivClass}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-700">Recent Orders</h3>
        <ExportCSVButton
          data={orders}
          filename="procurement_orders"
          headers={PROCUREMENT_HEADERS}
          dataMapper={procurementDataMapper}
          fetchData={procurementService.getAll}
          disabled={totalRecords === 0}
        />
      </div>

      <div className={tableDiv2Class}>
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-yellow-100">
            <tr>
              {['S/N', 'Supplier', 'Quantity', 'Transport Cost', 'Total Cost', 'Delivery Date', 'Action'].map(
                (header) => (
                  <th key={header} className={thClass}>
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              currentOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-yellow-50/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900 capitalize">
                    {order.supplier}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col">
                      <span className="font-semibold text-yellow-700">{Number(order.quantity) / 1000} tons</span>
                      <span className="text-xs text-gray-500">{order.quantity} kg</span>
                      <span className="text-xs text-gray-500">
                        @{Number(order.price_per_kg).toLocaleString()}/=
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-red-500">
                    {Number(order.transport_cost).toLocaleString()}/=
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-bold text-right text-green-600">
                    {Number(order.total_cost).toLocaleString()}/=
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-700">{order.delivery_date}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <TableActions item={order} handleEdit={handleEdit} handleDelete={handleDelete} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
    </div>
  );
};

export default OrdersTable;
