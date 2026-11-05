import { useSalesLogic } from '../hooks/useSalesLogic';
import SalesForm from '../components/dashboard/sales/SalesForm';
import SalesTable from '../components/dashboard/sales/SalesTable';

const SalesDashboard = () => {
  const {
    formData,
    sales,
    error,
    loading,
    saving,
    editId,
    currentPage,
    currentSales,
    totalPages,
    indexOfFirst,
    updating,
    loadError,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    paginate,
    productFilter,
    sackSizeFilter,
    handleFilterChange,
    summary,
    summaryLoading,
    summaryError,
  } = useSalesLogic();

  return (
    <div className="text-gray-900 grid grid-cols-1 2xl:grid-cols-3 gap-4">
      <div className="2xl:grid-col-1">
        <SalesForm
          formData={formData}
          handleChange={handleChange}
          handleSaveOrUpdate={handleSaveOrUpdate}
          editId={editId}
          error={error}
          handleCancelEdit={handleCancelEdit}
          saving={saving}
        />
      </div>

      <div className="mt-8 2xl:col-span-2">
        <SalesTable
          sales={sales}
          currentSales={currentSales}
          indexOfFirst={indexOfFirst}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          loading={loading}
          updating={updating}
          loadError={loadError}
          productFilter={productFilter}
          sackSizeFilter={sackSizeFilter}
          handleFilterChange={handleFilterChange}
          summary={summary}
          summaryLoading={summaryLoading}
          summaryError={summaryError}
        />
      </div>
    </div>
  );
};

export default SalesDashboard;
