import { useState, useEffect } from "react"

import OverviewKPI from "../components/dashboardcomponents/analytics/OverviewKPI"
import { ChartWithPagination } from "../components/dashboardcomponents/analytics/ChartWithPagination"

import { salesService } from "../services/salesService"
import { productionService } from "../services/productionApi"
import { procurementService } from "../services/procurementApi"
import { expenseService } from "../services/expenseService"
import { Header } from "../components/dashboardcomponents/analytics/Header"
import RevenueExpenses from "../components/dashboardcomponents/analytics/RevenueExpenses"
import CostVsSales from "../components/dashboardcomponents/analytics/CostVsSales"
import SalesVsCostOverall from "../components/dashboardcomponents/analytics/SalesVsCostOverall"

const Analytics = () => {
    const [darkMode, setDarkMode] = useState(false)
    const [loading, setLoading] = useState(false)

    const [revenueData, setRevenueData] = useState([])
    
    const [costSalesData, setCostSalesData] = useState([])
  

    const [revenuePage, setRevenuePage] = useState(1)
    const [productionPage, setProductionPage] = useState(1)
    const [costSalesPage, setCostSalesPage] = useState(1)

  // newState
    const [productionData, setProductionData] = useState([])
    const [procurementData, setProcurementData] = useState([])
    const [totals, setTotals] = useState({ totalSales: 0, totalCosts: 0 })

    const [maize, setMaize] = useState(0)
    const [bran, setBran] = useState(0)
    const [flour, setFlour] = useState(0)
 


  // Aggregate daily by key mapping
  const aggregateByDate = (items, keyMap, dateKey = "date") => {
    const map = {}
    items.forEach(item => {
      const dateObj = new Date(item[dateKey] || item.created_at)
      const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
      const date = localDate.toISOString().split("T")[0]

      if (!map[date]) map[date] = {}
      Object.keys(keyMap).forEach(k => {
        map[date][k] = (map[date][k] || 0) + parseFloat(item[keyMap[k]] || 0)
      })
    })
    // Sort by date and format dates for display
    return Object.entries(map)
      .map(([date, values]) => ({ 
        period: date, 
        periodFormatted: formatDate(date),
        ...values 
      }))
      .sort((a, b) => new Date(a.period) - new Date(b.period))
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Number(num).toFixed(2))
  }

  const refreshData = async () => {
    setLoading(true)
    try {
      const [sales, production, procurement, expenses] = await Promise.all([
        salesService.getAll(),
        productionService.getAll(),
        procurementService.getAll(),
        expenseService.getAll(),
      ])



     
      // --- Revenue vs Expenses (daily) ---
      const revenueAgg = aggregateByDate(sales, { revenue: "total_amount" })
      const expensesAgg = aggregateByDate(expenses, { expenses: "amount" })
      
      // Combine all unique dates from both datasets
      const allRevenueDates = Array.from(new Set([
        ...revenueAgg.map(d => d.period),
        ...expensesAgg.map(e => e.period)
      ]))
      
      // Merge properly with all dates
      const revenueMerged = allRevenueDates.map(date => ({
        period: date,
        periodFormatted: formatDate(date),
        revenue: revenueAgg.find(d => d.period === date)?.revenue || 0,
        expenses: expensesAgg.find(e => e.period === date)?.expenses || 0,
      })).sort((a, b) => new Date(a.period) - new Date(b.period))
      
      setRevenueData(revenueMerged)

      // --- Maize Procured vs Flour Produced (daily) ---
      const productionAgg = aggregateByDate(production, {
        maizeProcured: "maize_quantity",
        maizeFlourProduced: "flour_output",
      })
      setProductionData(productionAgg)

      // --- Procurement daily aggregation ---
    // const procurementAgg = aggregateByDate(procurement, { totalCost: "total_cost" }, "delivery_date")
    // setProcurementData(procurementAgg)

      // --- Maize Cost vs Flour & Bran Sales (daily) ---
      // --- Maize Cost vs Flour & Bran Sales (daily) ---
const maizeCost = aggregateByDate(procurement, { maizeCost: "total_cost" }, "delivery_date")
const flourRevenue = aggregateByDate(sales, { flourBranRevenue: "total_amount" })

// Combine all unique dates from both datasets
const allDates = Array.from(new Set([
  ...maizeCost.map(d => d.period),
  ...flourRevenue.map(f => f.period)
]))

// Merge properly with formatted dates
const costVsSales = allDates.map(date => ({
  period: date,
  periodFormatted: formatDate(date),
  maizeCost: maizeCost.find(d => d.period === date)?.maizeCost || 0,
  flourBranRevenue: flourRevenue.find(f => f.period === date)?.flourBranRevenue || 0,
})).sort((a, b) => new Date(a.period) - new Date(b.period))

      setCostSalesData(costVsSales)

      // --- Totals (overall) ---
      const totalSales = sales.reduce((sum, s) => sum + (parseFloat(s.total_amount) || 0), 0)
      const totalCosts =
        procurement.reduce((sum, p) => sum + (parseFloat(p.total_cost) || 0), 0) +
        expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0) +
        sales.reduce((sum, s) => sum + (parseFloat(s.delivery_cost) || 0), 0)
      setTotals({ totalSales, totalCosts })
      const totalMaize = procurement.reduce(
        (sum, p) => sum + (parseFloat(p.quantity) || 0),
        0
      )
      setMaize(totalMaize)
      const totalFlour = production.reduce(
        (sum, p) => sum + (parseFloat(p.flour_output) || 0),
        0
      )
      setFlour(totalFlour)
      const totalBran = production.reduce(
        (sum, p) => sum + (parseFloat(p.bran_output || 0)),
        0
      )
      setBran(totalBran)


    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshData()
  }, [])



  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header/>

        {/* KPI Cards */}
        
        <OverviewKPI
          totals={totals}
          maize={maize}
          flour={flour}
          bran={bran}
        />

        <SalesVsCostOverall totals={totals}/>

        <RevenueExpenses data={revenueData} darkMode={darkMode} formatNumber={formatNumber} />  

        

        <CostVsSales data={costSalesData} totals={totals} darkMode={darkMode} formatNumber={formatNumber} />

        {/* Detailed Charts with Pagination */}
        <ChartWithPagination
          title="Revenue vs Expenses Trend (Daily)"
          data={revenueData}
          page={revenuePage}
          setPage={setRevenuePage}
          darkMode={darkMode}
          lines={["revenue", "expenses"]}
          formatNumber={formatNumber}
        />
        <ChartWithPagination
          title="Production Trends (Daily)"
          data={productionData}
          page={productionPage}
          setPage={setProductionPage}
          darkMode={darkMode}
          bars={["maizeProcured", "maizeFlourProduced"]}
          formatNumber={formatNumber}
        />
       

      </div>
    </div>
  )
}

// --- ChartWithPagination component ---


export default Analytics
