
import OverviewCard from "../components/dashboardcomponents/expenses/OverviewCard";
import ExpenseCharts from "../components/dashboardcomponents/expenses/ExpenseCharts";
import ExpenseForm from "../components/dashboardcomponents/expenses/ExpenseForm";
import ExpenseTable from "../components/dashboardcomponents/expenses/ExpenseTable";
import { useExpensesLogic } from "../hooks/useExpenseLogic";// ✅ the backend-integrated hook

export default function Expenses() {
  // --- Hook handles all logic (fetch, CRUD, filter, pagination, summary) ---
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
  } = useExpensesLogic();

  if (loading) return <div className="p-6 text-gray-500">Loading expenses...</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
      <h1 className={"text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-yellow-700"}>
        Operational Expenses Tracking
      </h1>

     

      {/* 1. Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {overviewData.map(card => (
          <OverviewCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
      </div>

      {/* 2. Charts */}
      <ExpenseCharts
        categoryChartData={categoryChartData}
        
      />

      {/* 3. Expense Form */}
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

      {/* 4. Expense Table */}
      <ExpenseTable
        expenses={expenses} // All expenses from backend
        currentExpenses={currentExpenses}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        currentPage={currentPage}
        loading={loading}
        paginate={paginate}
        indexOfFirst={indexOfFirst}
        totalPages={totalPages}
      />
    </div>
  );
}
