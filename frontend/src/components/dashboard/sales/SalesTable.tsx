import ExportCSVButton from '../common/ExportCSVButton';
import TablePagination from '../common/TablePagination';
import TableActions from '../common/TableActions';
import { SALES_HEADERS, salesDataMapper } from '../../data/CSVData';
import { tableDiv2Class, tableDivClass, thClass } from '../common/cssCommon';
import type { Sale } from '../../../types';
import { salesService } from '../../../services/salesService';

interface SalesSummary {
  flour5kg: number;
  flour10kg: number;
  flour25kg: number;
  bran: number;
}

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
  updating: boolean;
  loadError: string | null;
  productFilter: string;
  sackSizeFilter: string;
  handleFilterChange: (name: 'productType' | 'sackSize', value: string) => void;
  summary: SalesSummary;
  summaryLoading: boolean;
  summaryError: string | null;
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
  updating,
  loadError,
  productFilter,
  sackSizeFilter,
  handleFilterChange,
  summary,
  summaryLoading,
  summaryError,
}: SalesTableProps) => {
  return (
    <div className={tableDivClass}>
      {summaryError && <p className="mb-3 text-sm text-red-600" role="alert">{summaryError}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {[
          ['Flour sales · 5 kg', summary.flour5kg],
          ['Flour sales · 10 kg', summary.flour10kg],
          ['Flour sales · 25 kg', summary.flour25kg],
          ['Bran sales', summary.bran],
        ].map(([label, amount]) => (
          <div key={label} className="rounded-lg border-l-4 border-green-600 bg-green-50 p-4 shadow-sm">
            <p className="text-xs text-gray-600">{label}</p>
            <p className="mt-1 font-bold text-green-800">{summaryLoading ? 'Loading...' : `${Number(amount).toLocaleString()}/=`}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-yellow-700">Sales Records</h3>
          {updating && <span className="text-xs text-gray-500">Updating...</span>}
        </div>
        <div className="flex gap-2">
          <select
            aria-label="Filter sales by product"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            value={productFilter}
            onChange={(event) => handleFilterChange('productType', event.target.value)}
          >
            <option value="All">All products</option>
            <option value="flour">Flour</option>
            <option value="bran">Bran</option>
          </select>
          <select
            aria-label="Filter flour sales by sack size"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            value={sackSizeFilter}
            disabled={productFilter === 'bran'}
            onChange={(event) => handleFilterChange('sackSize', event.target.value)}
          >
            <option value="">All sack sizes</option>
            <option value="5">5 kg</option>
            <option value="10">10 kg</option>
            <option value="25">25 kg</option>
          </select>
        </div>
        <ExportCSVButton
          data={sales}
          filename="sales_records"
          headers={SALES_HEADERS}
          dataMapper={salesDataMapper}
          fetchData={salesService.getAll}
          disabled={sales.length === 0}
        />
      </div>

      <div className={tableDiv2Class}>
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-yellow-100">
            <tr>
              {['S/N', 'Customer', 'Product', 'Amount', 'Delivery', 'Date', 'Action'].map(
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
            ) : loadError ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-red-600" role="alert">
                  {loadError}
                </td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                  No sales records match the selected filters.
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
                      ? `Bran — ${sale.sack_count ?? 0} sacks`
                      : `Flour — ${sale.sack_count ?? 0} × ${sale.sack_size ?? '?'} kg sacks`}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {Number(sale.total_amount).toLocaleString()}/=
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div>{sale.delivery_address}</div>
                    <div className="text-xs text-red-500">
                      Cost: {Number(sale.delivery_cost).toLocaleString()}/=
                    </div>
                  </td>
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
