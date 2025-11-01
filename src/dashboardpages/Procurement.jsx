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
  } = useProcurementLogic() // destructuring data and function required

  // --- RENDER ---
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-gray-900">
      
      {/* 1. Procurement Form */}
      <div className="lg:col-span-1">
        <ProcurementForm 
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

      {/* 2. Orders Table & Pagination */}
      <div className="lg:col-span-2">
        <OrdersTable
          orders={orders} // All orders for export
          currentOrders={currentOrders} // Paginated data for display
          indexOfFirst={indexOfFirst}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      </div>
    </div>
  )
}

export default ProcurementDashboard