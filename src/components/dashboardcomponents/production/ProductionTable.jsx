

import ExportCSVButton from "../../common/ExportCSVButton"
import TablePagination from '../../common/TablePagination';
import { Pencil, Trash2 } from 'lucide-react';
import TableActions from '../../common/TableActions';

// Define the Production-specific CSV headers
const PRODUCTION_HEADERS = [
  "S/N", "Date", "Maize Quantity (kg)", "Flour Output (kg)", 
  "Bran Output (kg)", "Water Usage (L)", "Electricity Usage (kWh)", 
  "Sacks Used", "Employee Notes",
];

// Define the Production-specific data mapper function
const productionDataMapper = (batch, index) => [
  index + 1,
  batch.date,
  batch.maizeQuantity,
  batch.flourOutput,
  batch.branOutput,
  batch.waterUsage,
  batch.electricityUsage,
  batch.sacksUsed,
  batch.employeeNotes || "",
];




// Local component to match the structure of the original Procurement component set
// const TableActions = ({ batch, handleEdit, handleDelete }) => (
//     <div className="flex gap-2">
//         <button 
//             onClick={() => handleEdit(batch)} 
//             title="Edit Batch"
//             className="text-blue-500 hover:text-blue-700 p-1 rounded-full transition-colors duration-150"
//         >
//             <Pencil className="h-4 w-4" />
//         </button>
//         <button 
//             onClick={() => handleDelete(batch.id)} 
//             title="Delete Batch"
//             className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors duration-150"
//         >
//             <Trash2 className="h-4 w-4" />
//         </button>
//     </div>
// );


const ProductionTable = ({
  batches, // All batches (for export)
  currentBatches, // Paginated data
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
        <h3 className="text-xl font-bold text-yellow-700">Production Batches</h3>
        <ExportCSVButton
            data={batches}
            filename="production_batches"
            headers={PRODUCTION_HEADERS}
            dataMapper={productionDataMapper}
            disabled={batches.length === 0}
        />
      </div>

      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 italic">
          <thead className="bg-yellow-100">
            <tr>
              {["No", "Date / Input", "Outputs", "Resources", "Notes", "Action"].map(header => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-yellow-700 whitespace-nowrap">
                      {header}
                  </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {batches.length === 0 ? (
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
                    <div className="text-sm text-gray-500">{batch.date}</div>
                  </td>

                  {/* Maize Input */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="font-semibold text-yellow-700">{batch.maizeQuantity} kg</span>
                  </td>
                  
                  {/* Outputs */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="text-green-700">Flour: {batch.flourOutput}kg</div>
                    <div className="text-green-600">Bran: {batch.branOutput}kg</div>
                  </td>
                  
                  {/* Resources (Styled slightly red) */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-red-500">
                    <div>Water: {batch.waterUsage}L</div>
                    <div>Power: {batch.electricityUsage}kWh</div>
                    <div>Sacks: {batch.sacksUsed}</div>
                  </td>
                  
                  {/* Notes */}
                  <td className="px-4 py-4 max-w-xs overflow-hidden text-ellipsis text-gray-500">
                    {batch.employeeNotes || "—"}
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