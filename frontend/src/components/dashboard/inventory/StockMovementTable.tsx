import type { ChangeEvent } from 'react';
import ExportCSVButton from '../common/ExportCSVButton';
import { INVENTORY_HEADERS, inventoryDataMapper } from '../../data/CSVData';
import useStockMovement from '../../../hooks/useStockMovementLogic';
import { inventoryService } from '../../../services/inventoryService';
import type { InventoryMovement } from '../../../types';

const ROWS_PER_PAGE = 7;

export default function StockMovementTable() {
  const {
    currentPage,
    totalPages,
    filterItem,
    filterSource,
    filteredMovements,
    paginatedMovements,
    handlePrev,
    handleNext,
    handleFilterChange,
    totalRecords,
    loading,
    error,
  } = useStockMovement(ROWS_PER_PAGE);

  const fetchFilteredMovements = async (): Promise<InventoryMovement[]> => {
    const allMovements = await inventoryService.getAllMovements();
    return allMovements.filter((movement) => {
      const itemMatch =
        filterItem === 'All' ||
        (filterItem === 'Bran'
          ? movement.item.toLowerCase().startsWith('bran')
          : movement.item.toLowerCase() === filterItem.toLowerCase());
      const sourceMatch =
        filterSource === 'All' ||
        movement.source.toLowerCase() === filterSource.toLowerCase();
      return itemMatch && sourceMatch;
    });
  };

  return (
    <section className="rounded-xl p-6 shadow-xl bg-white border border-yellow-200">
      <h2 className={'text-xl font-bold text-yellow-700'}>Stock Movement History</h2>

      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 mt-4 gap-3 sm:gap-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={filterItem}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange(e, 'item')}
            className="px-3 py-1 rounded bg-yellow-50 border border-gray-300 text-gray-900 min-w-[120px]"
          >
            <option value="All">All Items</option>
            <option value="Maize">Maize</option>
            <option value="Flour">Flour</option>
            <option value="Bran">Bran</option>
            <option value="5 kg Sacks">5 kg Sacks</option>
            <option value="10 kg Sacks">10 kg Sacks</option>
            <option value="25 kg Sacks">25 kg Sacks</option>
            <option value="Unspecified Sacks">Unspecified Sacks (legacy)</option>
          </select>

          <select
            value={filterSource}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleFilterChange(e, 'source')}
            className="px-3 py-1 rounded bg-yellow-50 border border-gray-300 text-gray-900 min-w-[120px]"
          >
            <option value="All">All Sources</option>
            <option value="Procurement">Procurement</option>
            <option value="Production">Production</option>
            <option value="Sales">Sales</option>
            <option value="Expense">Expense</option>
          </select>
        </div>

        <ExportCSVButton
          data={filteredMovements}
          filename="inventory_data"
          headers={INVENTORY_HEADERS}
          dataMapper={inventoryDataMapper}
          fetchData={fetchFilteredMovements}
          disabled={totalRecords === 0}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              {['S/N', 'Date', 'Item', 'Quantity In', 'Quantity Out', 'Source/Destination', 'Balance', 'Remarks'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Loading inventory movements...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-red-600" role="alert">
                  Failed to load inventory movements.
                </td>
              </tr>
            ) : paginatedMovements.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No movements available
                </td>
              </tr>
            ) : (
              paginatedMovements.map((m, index) => (
                <tr key={`${m.date}-${m.source}-${m.item}-${m.remarks}-${index}`} className="hover:bg-yellow-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">
                    {(currentPage - 1) * ROWS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm">{m.date?.split('T')[0]}</td>
                  <td className="px-4 py-3 text-sm font-medium text-yellow-700">{m.item}</td>
                  <td className="px-4 py-3 text-sm text-green-600">{m.quantityIn ?? 0}</td>
                  <td className="px-4 py-3 text-sm text-red-600">{m.quantityOut ?? 0}</td>
                  <td className="px-4 py-3 text-sm">{m.source}</td>
                  <td className="px-4 py-3 text-sm font-bold text-blue-700">{m.balance}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <button
            onClick={handlePrev}
            className="px-3 py-1 rounded bg-yellow-500 text-gray-900 font-semibold disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            className="px-3 py-1 rounded bg-yellow-500 text-gray-900 font-semibold disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
