
import { useSalesLogic } from "../hooks/useSalesLogic";
import SalesForm from "../components/dashboardcomponents/sales/salesForm";
import SalesTable from "../components/dashboardcomponents/sales/SalesTable";

const Sales = () => {
  
  const {
    formData,
    sales,
    wordCount,
    currentSales,
    loading,
    saving,
    error,
    editId,
    currentPage,
    totalPages,
    indexOfFirst,
    handleChange,
    handleSaveOrUpdate,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    paginate,
    totalCost
  } = useSalesLogic();

  return (
    <div className="text-gray-900 grid grid-cols-1 2xl:grid-cols-3 gap-4">
      <div className="2xl:grid-col-1">
      {/* Sales Form */}
      <SalesForm
        formData={formData}
        handleChange={handleChange}
        wordCount={wordCount}
        handleSaveOrUpdate={handleSaveOrUpdate}
        editId={editId}
        handleCancelEdit={handleCancelEdit}
        saving={saving}
        error={error}
        totalCost={Number(totalCost)}
      />
      </div>

      <div className="mt-8 2xl:col-span-2">
      {/* Sales Table */}
      <SalesTable
        sales={sales}
        currentSales={currentSales}
        loading={loading}
        indexOfFirst={indexOfFirst}
        totalPages={totalPages}
        currentPage={currentPage}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        paginate={paginate}
      />
      </div>
    </div>
  );
};

export default Sales;