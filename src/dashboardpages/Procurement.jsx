import ProcurementForm from "../components/dashboardcomponents/procurement/ProcurementForm"
import OrdersTable from "../components/dashboardcomponents/procurement/OrdersTable"
import { useProcurementLogic } from "../hooks/useProcurementLogic"

const ProcurementDashboard = () => {
  
  const {
    formData,
    orders,
    editId,
    currentPage,
    currentOrders,
    totalPages,
    indexOfFirst,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    paginate,
  } = useProcurementLogic()

  // --- RENDER ---
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-gray-900">
      
      {/* 1. Procurement Form */}
      <div className="lg:col-span-1">
        <ProcurementForm 
          formData={formData}
          setFormData={setFormData}
          editId={editId}
          handleSubmit={handleSubmit}
          handleCancelEdit={handleCancelEdit}
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