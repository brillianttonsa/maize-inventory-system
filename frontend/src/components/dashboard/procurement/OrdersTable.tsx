import { Pencil } from 'lucide-react';
import TablePagination from '../common/TablePagination';
import { tableDiv2Class, tableDivClass, thClass } from '../common/cssCommon';
import type { ProcurementOrder } from '../../../types';
import type { ProcurementSummary } from '../../../services/procurementApi';

interface OrdersTableProps {
  orders: ProcurementOrder[];
  currentOrders: ProcurementOrder[];
  handleEdit: (order: ProcurementOrder) => void;
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
  loading: boolean;
  summary: ProcurementSummary;
  summaryLoading: boolean;
  summaryError: string | null;
}

const money = (value: number) => `${value.toLocaleString()}/=`;

const OrdersTable = ({ orders, currentOrders, handleEdit, currentPage, totalPages, paginate, loading, summary, summaryLoading, summaryError }: OrdersTableProps) => (
  <div className={tableDivClass}>
    {summaryError && <p className="mb-3 text-sm text-red-600" role="alert">{summaryError}</p>}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
      {[
        ['Total quantity procured', `${(summary.totalQuantityKg / 1000).toLocaleString()} tons`],
        ['Total acquisition cost', money(summary.totalCost)],
        ['Actual maize purchase', money(summary.actualMaizePurchase)],
        ['Average total cost / kg', money(summary.averageTotalCostPerKg)],
      ].map(([label, value]) => <div key={label} className="rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-4 shadow-sm"><p className="text-xs text-gray-600">{label}</p><p className="mt-1 font-bold text-yellow-800">{summaryLoading ? 'Loading...' : value}</p></div>)}
    </div>
    <h3 className="text-xl font-bold text-yellow-700 mb-4">Procurement records</h3>
    <div className={tableDiv2Class}><table className="min-w-full divide-y divide-gray-200"><thead className="bg-yellow-100"><tr>
      {['Date', 'Supplier', 'Location / phone', 'Quantity', 'Actual maize purchase', 'Transport', 'Collection', 'Loading', 'Unloading', 'Transport tax', 'Rural tax', 'Acquisition cost', 'Action'].map(header => <th key={header} className={thClass}>{header}</th>)}
    </tr></thead><tbody className="divide-y divide-gray-100">
      {loading ? <tr><td colSpan={13} className="px-4 py-4 text-center text-gray-500">Loading...</td></tr> : orders.length === 0 ? <tr><td colSpan={13} className="px-4 py-4 text-center text-gray-500">No procurement records yet.</td></tr> : currentOrders.map(order => <tr key={order.id} className="hover:bg-yellow-50/50">
        <td className="px-4 py-3 whitespace-nowrap">{order.delivery_date}</td><td className="px-4 py-3 font-medium capitalize">{order.supplier}</td><td className="px-4 py-3 text-sm">{order.supplier_location}<br />{order.supplier_phone}</td>
        <td className="px-4 py-3 text-right">{Number(order.quantity_of_maize).toLocaleString()} tons</td><td className="px-4 py-3 text-right">{money(Number(order.maize_purchase_cost))}</td><td className="px-4 py-3 text-right">{money(Number(order.transport_cost))}</td><td className="px-4 py-3 text-right">{money(Number(order.collection_labour))}</td><td className="px-4 py-3 text-right">{money(Number(order.loading_labour))}</td><td className="px-4 py-3 text-right">{money(Number(order.unloading_labour))}</td><td className="px-4 py-3 text-right">{money(Number(order.transport_tax))}</td><td className="px-4 py-3 text-right">{money(Number(order.rural_tax))}</td><td className="px-4 py-3 text-right font-bold text-green-700">{money(Number(order.total_cost))}</td>
        <td className="px-4 py-3"><button onClick={() => handleEdit(order)} title="Edit" className="text-blue-500 hover:text-blue-700 p-1"><Pencil className="h-4 w-4" /></button></td>
      </tr>)}</tbody></table></div>
    <TablePagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
  </div>
);

export default OrdersTable;
