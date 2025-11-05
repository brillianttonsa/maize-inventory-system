import { useState, useEffect, useMemo } from "react";
import { expenseService } from "../services/expenseService";
import { CATEGORIES, CATEGORY_COLORS, OVERVIEW_ICONS } from "../components/dashboardcomponents/expenses/constants";
import { getTodayDate } from "../components/utils/todaydate";
import { resetForm } from "../components/common/ResetForm";
import { checkingValidityCountOfNote, wordCounts } from "../components/common/NotesMaxCount";
import { formatData } from "../components/utils/formatDate";


// --------------------
// Initial Form Data
// --------------------
const initialFormData = {
  date: getTodayDate(),
  category: "",
  amount: "",
  unitValue: "", 
  paidBy: "",
  method: "",
  notes: "",
};

// Helper function to check if a category requires a unit input
const requiresUnitInput = (category) => {
  const lowerCategory = category.toLowerCase();
  return (
      lowerCategory.includes('water') || 
      lowerCategory.includes('sacks') || 
      lowerCategory.includes('electricity')
  );
};

export const useExpensesLogic = () => {
  // States
  const [formData, setFormData] = useState(initialFormData);
  const [expenses, setExpenses] = useState([]); // API-driven data
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCategory, setFilterCategory] = useState("All");
  const itemsPerPage = 5;

  // --------------------
  // Fetch Expenses from Backend
  // --------------------
  const fetchExpenses = async () => {
      try {
        const data = await expenseService.getAll();

        const formatted = formatData(data)
        setExpenses(formatted);
        console.log(formatted);
        
      } catch (err) {
        console.error(err);
        setError("Failed to fetch expenses")
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchExpenses();
  }, []);

  


  // --------------------------------------------------------
  // 2. DATA PROCESSING (Overview & Charts)
  // --------------------------------------------------------

  // 2.1 Filtered Expenses for Table/Category Chart
  const filteredExpenses = useMemo(() => {
    // Filter by category if not "All"
    const relevantExpenses =
      filterCategory === "All"
        ? expenses
        : expenses.filter(exp => exp.category === filterCategory);
  
    // Sort by date (newest first)
    return relevantExpenses.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [expenses, filterCategory]);
  

  // 2.2 Overview Cards Data
  const overviewData = useMemo(() => {
    const totalAllTime = expenses.reduce((sum, exp) => sum + +exp.amount, 0);

    // / Group by category for individual totals (uses ALL expenses)
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + +exp.amount;
      return acc;
    }, {});

    // Use the full CATEGORIES list and map icons/colors
    const cards = CATEGORIES.map(({ name }) => ({
      title: name,
      value: categoryTotals[name] || 0,
      // Use the utility object to find the icon by title (name)
      icon: OVERVIEW_ICONS[name] || OVERVIEW_ICONS.Wallet, // Default to Wallet if not found
      color: name, // Placeholder, colors are handled in OverviewCard
    }));

    // Add the overall total card
    cards.unshift({
      title: `Total (All Time)`,
      value: totalAllTime,
      icon: OVERVIEW_ICONS.Wallet,
      color: "yellow", // Use a standard color for the main metric
    });

    return cards;
  }, [expenses]);

  // 2.3 Chart Data
  const categoryChartData = useMemo(() => {
    return filteredExpenses
      .reduce((acc, exp) => {
        const existing = acc.find((item) => item.name === exp.category);
        if (existing) {
          existing.amount += +exp.amount;
        } else {
          acc.push({
            name: exp.category,
            amount: +exp.amount,
            fill: CATEGORY_COLORS[exp.category], // Add color for charts
          });
        }
        return acc;
      }, [])
      .filter((item) => item.amount > 0); // Remove empty categories
  }, [filteredExpenses]);



  // --------------------------------------------------------
  // 3. CRUD Operations (Service Integration)
  // --------------------------------------------------------

  

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null)
    
    // Check word count constraint for 'notes'
    if (name === 'notes' && checkingValidityCountOfNote(name, value)) return;

    setFormData((prev) => {
        const newState = { ...prev, [name]: value };

        if (name === 'category' && !requiresUnitInput(value)) {
            newState.unitValue = "";
        }

        
        if (name !== 'unitValue' && !requiresUnitInput(newState.category)) {
            newState.unitValue = "";
        }

        return newState;
    });
  };

  const wordCount = wordCounts(formData);

  // Save or update
  const handleSaveOrUpdate = async (e) => {
    e.preventDefault();
    setSaving(true)
    setError("")

    const { date, category, amount, unitValue, paidBy, method, notes} = formData;

    // Payload maps camelCase to snake_case for the API
    const payload = {
      date,
      category,
      amount: +amount,
      unit_value: +unitValue,
      paid_by: paidBy,
      method,
      notes
    };

    try {
      const newExpense = editId
        ? await expenseService.update(editId, payload)
        : await expenseService.create(payload);

      const data2 = editId ? expenses.map(o => (o.id === editId ? newExpense : o)) : [...expenses, newExpense]

      const formatted2 = formatData(data2)
      setExpenses(formatted2);

      resetForm({initialFormData, setFormData, setEditId})
    } catch (err) {
      console.error(err);
      // Note: Replaced alert with console.error/message box as per best practices
      setError(`Failed to ${editId ? "update" : "save"} expense.`,); 
    } finally{
      setSaving(false)
    }
  };

  // Edit
  const handleEdit = (expense) => {
    setFormData({
      date: expense.date,
      category: expense.category,
      amount: +expense.amount,
      unitValue: +expense.unit_value,
      paidBy: expense.paid_by,
      method: expense.method,
      notes: expense.notes,
    });
    setEditId(expense.id);
  };

  // Cancel edit (no changes needed)
  const handleCancelEdit = () => {
    resetForm({initialFormData, setFormData, setEditId})
  };

  // Delete
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this expense record?")){
      try{
        await expenseService.remove(id);
        setExpenses(prev => prev.filter(o => o.id !== id));
      } catch (error) {
        console.error(error)
        setError("Error in deleting expense")
      }
    }

  };


  
  // --- PAGINATION ---
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return {
    formData,
    wordCount,
    error,
    saving,
    expenses, // Raw data for export
    loading,
    currentPage,
    totalPages,
    currentExpenses,
    editId,
    filterCategory,
    indexOfFirst,
    overviewData, // New data for OverviewSection
    categoryChartData, // New data for charts
    paginate,
    handleChange,
    handleSaveOrUpdate,
    handleEdit,
    handleCancelEdit,
    handleDelete,
    setCurrentPage,
    setFilterCategory, // Expose setter for the table component
  };
};
