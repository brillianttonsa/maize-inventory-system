import ProcurementForm from '../components/dashboard/procurement/ProcurementForm';
import OrdersTable from '../components/dashboard/procurement/OrdersTable';
import { useProcurementLogic } from '../hooks/useProcurementLogic';

const ProcurementDashboard = () => {
  const {
    formData,
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
    loading,
  } = useProcurementLogic();

  return (
    <div className="text-gray-900 grid grid-cols-1 2xl:grid-cols-3 gap-4">
      <div className="2xl:grid-col-1">
        <ProcurementForm
          formData={formData}
          handleChange={handleChange}
          editId={editId}
          handleSaveOrUpdate={handleSaveOrUpdate}
          handleCancelEdit={handleCancelEdit}
          error={error}
          saving={saving}
          totalCost={Number(totalCost)}
        />
      </div>

      <div className="mt-8 2xl:col-span-2">
        <OrdersTable
          orders={orders}
          currentOrders={currentOrders}
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

export default ProcurementDashboard;
