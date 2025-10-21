
import React from "react";
import { useSalesLogic } from "../components/dashboardcomponents/sales/useSalesLogic";
import { exportSalesToCSV } from "../components/dashboardcomponents/sales/salesCsvExporter";
import SalesForm from "../components/dashboardcomponents/sales/salesForm";
import SalesTable from "../components/dashboardcomponents/sales/SalesTable";

const Sales = () => {
  
  const {
    formData,
    allSales,
    currentSales,
    loading,
    saving,
    editId,
    currentPage,
    totalPages,
    indexOfFirst,
    handleChange,
    handleSaveOrUpdate,
    handleDelete,
    handleEdit,
    handleCancelEdit,
    setCurrentPage,
  } = useSalesLogic();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sales Form */}
      <SalesForm
        formData={formData}
        handleChange={handleChange}
        handleSaveOrUpdate={handleSaveOrUpdate}
        editId={editId}
        handleCancelEdit={handleCancelEdit}
        saving={saving}
      />

      {/* Sales Table */}
      <SalesTable
        allSales={allSales}
        currentSales={currentSales}
        loading={loading}
        indexOfFirst={indexOfFirst}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleExportCSV={exportSalesToCSV}
      />
    </div>
  );
};

export default Sales;