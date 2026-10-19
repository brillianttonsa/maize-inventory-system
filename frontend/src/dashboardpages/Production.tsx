import { useProductionLogic } from '../hooks/useProductionLogic';
import ProductionForm from '../components/dashboard/production/ProductionForm';
import ProductionTable from '../components/dashboard/production/ProductionTable';

const ProductionDashboard = () => {
  const {
    formData,
    batches,
    editId,
    currentPage,
    currentBatches,
    totalPages,
    indexOfFirst,
    totalRecords,
    error,
    saving,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    paginate,
    loading,
  } = useProductionLogic();

  return (
    <div className="text-gray-900 grid grid-cols-1 2xl:grid-cols-3 gap-4">
      <div className="2xl:grid-col-1">
        <ProductionForm
          formData={formData}
          handleChange={handleChange}
          editId={editId}
          handleSaveOrUpdate={handleSaveOrUpdate}
          handleCancelEdit={handleCancelEdit}
          error={error}
          saving={saving}
        />
      </div>

      <div className="mt-8 2xl:col-span-2">
        <ProductionTable
          batches={batches}
          currentBatches={currentBatches}
          indexOfFirst={indexOfFirst}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          loading={loading}
          totalRecords={totalRecords}
        />
      </div>
    </div>
  );
};

export default ProductionDashboard;
