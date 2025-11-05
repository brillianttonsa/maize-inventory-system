import { useProductionLogic } from "../hooks/useProductionLogic";
import ProductionForm from "../components/dashboardcomponents/production/ProductionForm";
import ProductionTable from "../components/dashboardcomponents/production/ProductionTable";

const ProductionDashboard = () => {
  const {
    formData,
    wordCount,
    batches,
    editId,
    currentPage,
    currentBatches,
    totalPages,
    indexOfFirst,
    error,
    saving,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    paginate,
    loading
  } = useProductionLogic();

  // --- RENDER ---
  return (
    <div className="text-gray-900 grid grid-cols-1 2xl:grid-cols-3 gap-4">
      
      {/* 1. Production Form */}
      <div className="2xl:grid-col-1">
        <ProductionForm 
          formData={formData}
          handleChange={handleChange}
          wordCount={wordCount}
          editId={editId}
          handleSaveOrUpdate={handleSaveOrUpdate} 
          handleCancelEdit={handleCancelEdit}
          error={error}
          saving={saving}
        />
      </div>

      {/* 2. Production Table & Pagination */}
      <div className="mt-8 2xl:col-span-2">
        <ProductionTable
          batches={batches} // All batches for export
          currentBatches={currentBatches} // Paginated data for display
          indexOfFirst={indexOfFirst}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ProductionDashboard;