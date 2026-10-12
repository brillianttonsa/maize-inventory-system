import ExportCSVButton from '../common/ExportCSVButton';
import TablePagination from '../common/TablePagination';
import TableActions from '../common/TableActions';
import { SALES_HEADERS, salesDataMapper } from '../../data/CSVData';
import { tableDiv2Class, tableDivClass, thClass } from '../common/cssCommon';
import type { Sale } from '../../../../../maize-inventory-system/frontend/src/types';

interface SalesTableProps {
  sales: Sale[];
  currentSales: Sale[];
  indexOfFirst: number;
  handleEdit: (sale: Sale) => void;
  handleDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
  loading: boolean;
}

const SalesTable = ({
  sales,
  currentSales,
  indexOfFirst,
  handleEdit,
  handleDelete,
  currentPage,
  totalPages,
  paginate,
  loading,
}: SalesTableProps) => {
  return (
    <div className={tableDivClass}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-700">Sales Records</h3>
        <ExportCSVButton
          data={sales}
          filename="sales_records"
          headers={SALES_HEADERS}
          dataMapper={salesDataMapper}
          disabled={sales.length === 0}
        />
      </div>

      <div className={tableDiv2Class}>
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-yellow-100">
            <tr>
              {['S/N', 'Customer', 'Product', 'Amount', 'Delivery', 'Payment', 'Date', 'Action'].map(
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
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              currentSales.map((sale, index) => (
                <tr key={sale.id} className="hover:bg-yellow-50/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                    {indexOfFirst + index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.customer_name}</div>
                    <div className="text-xs text-gray-500">{sale.customer_contact}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm capitalize">
                    {sale.product_type === 'bran'
                      ? `Bran — ${sale.bran_unit_count ?? 'Unspecified'} ${sale.bran_unit?.replace('_', ' ') ?? ''} (${sale.bran_debe_quantity ?? sale.quantity} debe)`
                      : `Flour — ${sale.sack_count ?? 'Unspecified'} × ${sale.sack_size ?? '?'} kg (${sale.quantity} kg)`}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {(
                      (sale.product_type === 'bran'
                        ? Number(sale.bran_unit_count || 0)
                        : Number(sale.sack_count || 0)) * Number(sale.price_per_kg || 0)
                    ).toLocaleString()}/=
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div>{sale.delivery_address}</div>
                    <div className="text-xs text-red-500">
                      Cost: {Number(sale.delivery_cost).toLocaleString()}/=
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm capitalize">{sale.payment_method}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{sale.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <TableActions item={sale} handleEdit={handleEdit} handleDelete={handleDelete} />
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

export default SalesTable;
