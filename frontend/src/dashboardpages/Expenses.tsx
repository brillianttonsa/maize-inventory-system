import OverviewCard from '../components/dashboard/expenses/OverviewCard';
import ExpenseCharts from '../components/dashboard/expenses/ExpenseCharts';
import ExpenseForm from '../components/dashboard/expenses/ExpenseForm';
import ExpenseTable from '../components/dashboard/expenses/ExpenseTable';
import { useExpensesLogic } from '../hooks/useExpenseLogic';

export default function Expenses() {
  const {
    formData,
    expenses,
    filterCategory,
    setFilterCategory,
    saving,
    error,
    currentPage,
    editId,
    handleCancelEdit,
    handleChange,
    handleSaveOrUpdate,
    handleDelete,
    handleEdit,
    currentExpenses,
    wordCount,
    categoryChartData,
    overviewData,
    totalPages,
    paginate,
    indexOfFirst,
    loading,
    totalRecords,
  } = useExpensesLogic();

  if (loading) return <div className="p-6 text-gray-500">Loading expenses...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-yellow-700">
        Operational Expenses Tracking
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {overviewData.map((card) => (
          <OverviewCard key={card.title} title={card.title} value={card.value} icon={card.icon} color={card.color} />
        ))}
      </div>

      <ExpenseCharts categoryChartData={categoryChartData} />

      <div className="my-8">
        <ExpenseForm
          formData={formData}
          error={error}
          saving={saving}
          handleChange={handleChange}
          handleSaveOrUpdate={handleSaveOrUpdate}
          handleCancelEdit={handleCancelEdit}
          editId={editId}
          wordCount={wordCount}
        />
      </div>

      <ExpenseTable
        expenses={expenses}
        currentExpenses={currentExpenses}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        currentPage={currentPage}
        loading={loading}
        totalRecords={totalRecords}
        paginate={paginate}
        indexOfFirst={indexOfFirst}
        totalPages={totalPages}
      />
    </div>
  );
}
