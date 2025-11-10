import ExportCSVButton from "../../common/ExportCSVButton";
import { INVENTORY_HEADERS, inventoryDataMapper } from "../../data/CSVData";
import useStockMovement from "../../../hooks/useStockMovementLogic"; 

const ROWS_PER_PAGE = 7;

export default function StockMovementTable({ movements }) {
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
  } = useStockMovement(movements, ROWS_PER_PAGE);

  return (
    <section className="rounded-xl p-6 shadow-xl bg-white border border-yellow-200">
      <h2 className={"text-xl font-bold text-yellow-700"}>Stock Movement History</h2>
      
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 mt-4 gap-3 sm:gap-4">
        
        <div className="flex flex-wrap gap-3"> 
            {/* Item Filter */}
            <select
              value={filterItem}
              onChange={(e) => handleFilterChange(e, "item")}
              className="px-3 py-1 rounded bg-yellow-50 border border-gray-300 text-gray-900 min-w-[120px]"
            >
              <option value="All">All Items</option>
              <option value="Maize">Maize</option>
              <option value="Flour">Flour</option>
              <option value="Bran">Bran</option>
              <option value="Sacks">Sacks</option>
            </select>

            {/* Source/Destination Filter */}
            <select
              value={filterSource}
              onChange={(e) => handleFilterChange(e, "source")}
              className="px-3 py-1 rounded bg-yellow-50 border border-gray-300 text-gray-900 min-w-[120px]"
            >
              <option value="All">All Sources</option>
              <option value="Procurement">Procurement</option>
              <option value="Production">Production</option>
              <option value="Sales">Sales</option>
              <option value="Expense">Expense</option>
            </select>
        </div>

        {/* CSV Button - it will be positioned below the filters on small screens */}
        <ExportCSVButton
          data={filteredMovements}
          filename={"inventory_data"}
          headers={INVENTORY_HEADERS}
          dataMapper={inventoryDataMapper}
          disabled={filteredMovements.length === 0}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-yellow-50">
            <tr>
              {["S/N", "Date", "Item", "Quantity In", "Quantity Out", "Source/Destination", "Balance", "Remarks"].map(header => (
                <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
          {paginatedMovements.length === 0 ? (
  <tr>
    <td colSpan={8} className="text-center py-4 text-gray-500">
      No movements available
    </td>
  </tr>
) :(
            paginatedMovements.map((m, index) => (
              <tr key={index} className="hover:bg-yellow-50/50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-700">{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                <td className="px-4 py-3 text-sm">{m.date?.split("T")[0]}</td>
                <td className="px-4 py-3 text-sm font-medium text-yellow-700">{m.item}</td>
                <td className="px-4 py-3 text-sm text-green-600">{m.quantityIn ?? 0}</td>
                <td className="px-4 py-3 text-sm text-red-600">{m.quantityOut ?? 0}</td>
                <td className="px-4 py-3 text-sm">{m.source || m.destination}</td>
                <td className="px-4 py-3 text-sm font-bold text-blue-700">{m.balance}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{m.remarks}</td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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