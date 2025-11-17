import ProcurementForm from "../components/dashboardcomponents/procurement/ProcurementForm" // form
import OrdersTable from "../components/dashboardcomponents/procurement/OrdersTable" //table structure
import { useProcurementLogic } from "../hooks/useProcurementLogic" //hook

//procurement main page running all components
const ProcurementDashboard = () => {
  
  const {
    formData,
    wordCount,
    orders,
    editId,
    currentPage,
    currentOrders,
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
    totalCost,
    loading
  } = useProcurementLogic() // destructuring data and function required

  // --- RENDER ---
  
  return (
    <div className="text-gray-900 grid grid-cols-1 2xl:grid-cols-3 gap-4">
      
      {/* 1. Procurement Form */}
      <div className="2xl:grid-col-1">
        <ProcurementForm 
          formData={formData}
          handleChange={handleChange}
          wordCount={wordCount}
          editId={editId}
          handleSaveOrUpdate={handleSaveOrUpdate}
          handleCancelEdit={handleCancelEdit}
          error={error}
          saving={saving}
          totalCost={Number(totalCost)}
        />
      </div>

      {/* 2. Orders Table & Pagination */}
      <div className="mt-8 2xl:col-span-2">
        <OrdersTable
          orders={orders} // All orders for export
          currentOrders={currentOrders} // Paginated data for display
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
  )
}

export default ProcurementDashboard