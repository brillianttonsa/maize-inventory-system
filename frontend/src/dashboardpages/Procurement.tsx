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
    error,
    saving,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleCancelEdit,
    paginate,
    summary,
    summaryLoading,
    summaryError,
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
        />
      </div>

      <div className="mt-8 2xl:col-span-2">
        <OrdersTable
          orders={orders}
          currentOrders={currentOrders}
          handleEdit={handleEdit}
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          loading={loading}
          summary={summary}
          summaryLoading={summaryLoading}
          summaryError={summaryError}
        />
      </div>
    </div>
  );
};

export default ProcurementDashboard;
