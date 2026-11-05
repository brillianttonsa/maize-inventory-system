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
    error,
    saving,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleCancelEdit,
    paginate,
    loading,
    packaging,
    packagingLoading,
    packagingError,
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
          handleEdit={handleEdit}
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          loading={loading}
          packaging={packaging}
          packagingLoading={packagingLoading}
          packagingError={packagingError}
        />
      </div>
    </div>
  );
};

export default ProductionDashboard;
