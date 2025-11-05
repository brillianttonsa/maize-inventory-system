import ExportCSVButton from "../../common/ExportCSVButton";
import TablePagination from '../../common/TablePagination';
import TableActions from '../../common/TableActions';
import { PRODUCTION_HEADERS, productionDataMapper } from "../../data/CSVData";
import { tableDiv2Class, tableDivClass, thClass } from "../../common/cssCommon";


const ProductionTable = ({
  batches, // All batches (for export)
  currentBatches, // Paginated data
  indexOfFirst,
  handleEdit,
  handleDelete,
  currentPage,
  totalPages,
  paginate,
  loading
}) => {
    

  return (
    <div className={tableDivClass}>

      {/* Header and Export Button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-700">Production Batches</h3>
        <ExportCSVButton
            data={batches}
            filename="production_batches"
            headers={PRODUCTION_HEADERS}
            dataMapper={productionDataMapper}
            disabled={batches.length === 0}
        />
      </div>

      <div className={tableDiv2Class}>
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-yellow-100">
            <tr>
              {["S/N","Date", "Input", "Outputs", "Resources", "Notes", "Action"].map(header => (
                  <th key={header} className={thClass}>
                      {header}
                  </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : batches.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  No production batches yet.
                </td>
              </tr>
            ) : (
              currentBatches.map((batch, index) => (
                <tr key={batch.id} className="hover:bg-yellow-50/50 transition-colors">
                  
                  {/* Batch Number (S/N) & Date */}
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{indexOfFirst + index + 1}</div>
                    
                  </td>

                  {/* date */}
                  <td>
                  <div className="text-sm text-gray-500">{batch.date}</div>
                  </td>

                  {/* Maize Input */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="font-semibold text-yellow-700">{batch.maize_quantity} kg</span>
                  </td>
                  
                  {/* Outputs */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="text-green-700">Flour: {batch.flour_output}kg</div>
                    <div className="text-green-600">Bran: {batch.bran_output}kg</div>
                  </td>
                  
                  {/* Resources (Styled slightly red) */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-500">
                    <div>Water: {batch.water_usage}L</div>
                    <div>Power: {batch.electricity_usage}kWh</div>
                    <div>Sacks: {batch.sacks_used}</div>
                  </td>
                  
                  {/* Notes */}
                  <td className="px-4 py-4 max-w-xs overflow-hidden text-ellipsis text-gray-500">
                    {batch.notes || "—"}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-4 py-4 whitespace-nowrap">
                  <TableActions
                    item={batch} // Change 'batch' to 'item'
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

export default ProductionTable;