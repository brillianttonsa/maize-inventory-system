import ExportCSVButton from '../common/ExportCSVButton';
import TablePagination from '../common/TablePagination';
import TableActions from '../common/TableActions';
import { PRODUCTION_HEADERS, productionDataMapper } from '../../data/CSVData';
import { tableDiv2Class, tableDivClass, thClass } from '../common/cssCommon';
import type { ProductionBatch } from '../../../types';
import { productionService } from '../../../services/productionApi';

interface ProductionTableProps {
  batches: ProductionBatch[];
  currentBatches: ProductionBatch[];
  indexOfFirst: number;
  handleEdit: (batch: ProductionBatch) => void;
  handleDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  paginate: (page: number) => void;
  loading: boolean;
  totalRecords: number;
}

const ProductionTable = ({
  batches,
  currentBatches,
  indexOfFirst,
  handleEdit,
  handleDelete,
  currentPage,
  totalPages,
  paginate,
  loading,
  totalRecords,
}: ProductionTableProps) => {
  return (
    <div className={tableDivClass}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-yellow-700">Production Batches</h3>
        <ExportCSVButton
          data={batches}
          filename="production_batches"
          headers={PRODUCTION_HEADERS}
          dataMapper={productionDataMapper}
          fetchData={productionService.getAll}
          disabled={totalRecords === 0}
        />
      </div>

      <div className={tableDiv2Class}>
        <table className="min-w-full divide-y divide-gray-200 ">
          <thead className="bg-yellow-100">
            <tr>
              {['S/N', 'Date', 'Maize Input', 'Flour Output', 'Bran Output', 'Action'].map((header) => (
                <th key={header} className={thClass}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : batches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  No production batches yet.
                </td>
              </tr>
            ) : (
              currentBatches.map((batch, index) => (
                <tr key={batch.id} className="hover:bg-yellow-50/50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{indexOfFirst + index + 1}</div>
                  </td>

                  <td>
                    <div className="text-sm text-gray-500">{batch.date}</div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="font-semibold text-yellow-700">{batch.maize_quantity / 1000} tons</span>
                    <div className="text-xs text-gray-500">{batch.maize_quantity} kg</div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="text-green-700">{batch.flour_sacks_5kg} × 5 kg</div>
                    <div className="text-green-700">{batch.flour_sacks_10kg} × 10 kg</div>
                    <div className="text-green-700">{batch.flour_sacks_25kg} × 25 kg ({batch.flour_output} kg)</div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                    {batch.bran_debe_quantity ? `${Number(batch.bran_debe_quantity) / 7} gunia` : '-'}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <TableActions item={batch} handleEdit={handleEdit} handleDelete={handleDelete} />
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

export default ProductionTable;
