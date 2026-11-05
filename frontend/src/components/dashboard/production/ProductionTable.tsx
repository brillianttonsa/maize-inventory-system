import { Pencil } from 'lucide-react';
import TablePagination from '../common/TablePagination';
import { tableDiv2Class, tableDivClass, thClass } from '../common/cssCommon';
import type { ProductionBatch } from '../../../types';
import type { PackagingBreakdown } from '../../../services/productionApi';

interface ProductionTableProps {
  batches: ProductionBatch[]; currentBatches: ProductionBatch[]; handleEdit: (batch: ProductionBatch) => void;
  currentPage: number; totalPages: number; paginate: (page: number) => void; loading: boolean; packaging: PackagingBreakdown[]; packagingLoading: boolean; packagingError: string | null;
}

const ProductionTable = ({ batches, currentBatches, handleEdit, currentPage, totalPages, paginate, loading, packaging, packagingLoading, packagingError }: ProductionTableProps) => (
  <div className={tableDivClass}>
    <h3 className="text-xl font-bold text-yellow-700 mb-3">Flour packaging breakdown</h3>
    <div className="overflow-x-auto mb-7"><table className="min-w-full text-sm"><thead className="bg-yellow-100"><tr>{['Package size', 'Number of sacks', 'Total weight'].map(header => <th className={thClass} key={header}>{header}</th>)}</tr></thead><tbody>
      {packagingError ? <tr><td colSpan={3} className="px-4 py-3 text-center text-red-600" role="alert">{packagingError}</td></tr> : packagingLoading ? <tr><td colSpan={3} className="px-4 py-3 text-center text-gray-500">Loading...</td></tr> : <>
        {packaging.map(item => <tr key={item.packageSize} className="border-b"><td className="px-4 py-3">{item.packageSize} kg</td><td className="px-4 py-3 text-right">{item.sacks}</td><td className="px-4 py-3 text-right">{item.totalWeight.toLocaleString()} kg</td></tr>)}
        <tr className="bg-yellow-50 font-bold"><td className="px-4 py-3">TOTAL</td><td className="px-4 py-3 text-right">{packaging.reduce((sum, item) => sum + item.sacks, 0)}</td><td className="px-4 py-3 text-right">{packaging.reduce((sum, item) => sum + item.totalWeight, 0).toLocaleString()} kg</td></tr>
      </>}
    </tbody></table></div>
    <h3 className="text-xl font-bold text-yellow-700 mb-4">Production batches</h3>
    <div className={tableDiv2Class}><table className="min-w-full divide-y divide-gray-200"><thead className="bg-yellow-100"><tr>{['Date', 'Maize input', 'Flour output', 'Bran output', 'Action'].map(header => <th key={header} className={thClass}>{header}</th>)}</tr></thead><tbody className="divide-y divide-gray-100">
      {loading ? <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-500">Loading...</td></tr> : batches.length === 0 ? <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-500">No production batches yet.</td></tr> : currentBatches.map(batch => <tr key={batch.id} className="hover:bg-yellow-50/50"><td className="px-4 py-4">{batch.date}</td><td className="px-4 py-4">{(Number(batch.maize_quantity) / 1000).toLocaleString()} tons</td><td className="px-4 py-4 font-semibold text-green-700">{Number(batch.flour_output).toLocaleString()} kg</td><td className="px-4 py-4 text-green-600">{Number(batch.bran_quantity ?? 0).toLocaleString()} sacks</td><td className="px-4 py-4"><button onClick={() => handleEdit(batch)} title="Edit" className="text-blue-500 hover:text-blue-700 p-1"><Pencil className="h-4 w-4" /></button></td></tr>)}
    </tbody></table></div>
    <TablePagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
  </div>
);

export default ProductionTable;
