import { useState, useEffect } from 'react';

import OverviewKPI from '../components/dashboard/analytics/OverviewKPI';
import { ChartWithPagination, type PeriodDatum } from '../components/dashboard/analytics/ChartWithPagination';

import { salesService } from '../services/salesService';
import { productionService } from '../services/productionApi';
import { procurementService } from '../services/procurementApi';
import { expenseService } from '../services/expenseService';
import { Header } from '../components/dashboard/analytics/Header';
import RevenueExpenses from '../components/dashboard/analytics/RevenueExpenses';
import CostVsSales from '../components/dashboard/analytics/CostVsSales';
import SalesVsCostOverall from '../components/dashboard/analytics/SalesVsCostOverall';
import type { KPITotals } from '../components/dashboard/analytics/kpis';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const aggregateByDate = (
  items: Array<Record<string, any>>,
  keyMap: Record<string, string>,
  dateKey = 'date',
): PeriodDatum[] => {
  const map: Record<string, Record<string, number>> = {};
  items.forEach((item) => {
    const dateObj = new Date((item[dateKey] as string) || (item.created_at as string));
    const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
    const date = localDate.toISOString().split('T')[0];

    if (!map[date]) map[date] = {};
    Object.keys(keyMap).forEach((k) => {
      map[date][k] = (map[date][k] || 0) + parseFloat(String(item[keyMap[k]] ?? 0));
    });
  });

  return Object.entries(map)
    .map(([date, values]) => ({ period: date, periodFormatted: formatDate(date), ...values }))
    .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(Number(num.toFixed(2)));
};

const Analytics = () => {
  const [darkMode] = useState(false);
  const [, setLoading] = useState(false);

  const [revenueData, setRevenueData] = useState<PeriodDatum[]>([]);
  const [costSalesData, setCostSalesData] = useState<PeriodDatum[]>([]);

  const [revenuePage, setRevenuePage] = useState(1);
  const [productionPage, setProductionPage] = useState(1);

  const [productionData, setProductionData] = useState<PeriodDatum[]>([]);
  const [totals, setTotals] = useState<KPITotals>({ totalSales: 0, totalCosts: 0 });

  const [maize, setMaize] = useState(0);
  const [bran, setBran] = useState(0);
  const [flour, setFlour] = useState(0);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [sales, production, procurement, expenses] = await Promise.all([
        salesService.getAll(),
        productionService.getAll(),
        procurementService.getAll(),
        expenseService.getAll(),
      ]);

      const revenueAgg = aggregateByDate(sales, { revenue: 'total_amount' });
      const expensesAgg = aggregateByDate(expenses, { expenses: 'amount' });

      const allRevenueDates = Array.from(
        new Set([...revenueAgg.map((d) => d.period), ...expensesAgg.map((e) => e.period)]),
      );

      const revenueMerged: PeriodDatum[] = allRevenueDates
        .map((date) => ({
          period: date,
          periodFormatted: formatDate(date),
          revenue: revenueAgg.find((d) => d.period === date)?.revenue || 0,
          expenses: expensesAgg.find((e) => e.period === date)?.expenses || 0,
        }))
        .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

      setRevenueData(revenueMerged);

      const productionAgg = aggregateByDate(production, {
        maizeProcured: 'maize_quantity',
        maizeFlourProduced: 'flour_output',
      });
      setProductionData(productionAgg);

      const maizeCost = aggregateByDate(procurement, { maizeCost: 'total_cost' }, 'delivery_date');
      const flourRevenue = aggregateByDate(sales, { flourBranRevenue: 'total_amount' });

      const allDates = Array.from(new Set([...maizeCost.map((d) => d.period), ...flourRevenue.map((f) => f.period)]));

      const costVsSales: PeriodDatum[] = allDates
        .map((date) => ({
          period: date,
          periodFormatted: formatDate(date),
          maizeCost: maizeCost.find((d) => d.period === date)?.maizeCost || 0,
          flourBranRevenue: flourRevenue.find((f) => f.period === date)?.flourBranRevenue || 0,
        }))
        .sort((a, b) => new Date(a.period).getTime() - new Date(b.period).getTime());

      setCostSalesData(costVsSales);

      const totalSales = sales.reduce((sum, s) => sum + (parseFloat(String(s.total_amount)) || 0), 0);
      const totalCosts =
        procurement.reduce((sum, p) => sum + (parseFloat(String(p.total_cost)) || 0), 0) +
        expenses.reduce((sum, e) => sum + (parseFloat(String(e.amount)) || 0), 0) +
        sales.reduce((sum, s) => sum + (parseFloat(String(s.delivery_cost)) || 0), 0);
      setTotals({ totalSales, totalCosts });

      const totalMaize = procurement.reduce((sum, p) => sum + (parseFloat(String(p.quantity)) || 0), 0);
      setMaize(totalMaize);

      const totalFlour = production.reduce((sum, p) => sum + (parseFloat(String(p.flour_output)) || 0), 0);
      setFlour(totalFlour);

      const totalBran = production.reduce((sum, p) => sum + (parseFloat(String(p.bran_debe_quantity)) || 0) / 7, 0);
      setBran(totalBran);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <Header />

        <OverviewKPI totals={totals} maize={maize} flour={flour} bran={bran} />

        <SalesVsCostOverall totals={totals} />

        <RevenueExpenses data={revenueData} darkMode={darkMode} formatNumber={formatNumber} />

        <CostVsSales data={costSalesData} totals={totals} darkMode={darkMode} formatNumber={formatNumber} />

        <ChartWithPagination
          title="Revenue vs Expenses Trend (Daily)"
          data={revenueData}
          page={revenuePage}
          setPage={setRevenuePage}
          darkMode={darkMode}
          lines={['revenue', 'expenses']}
          formatNumber={formatNumber}
        />
        <ChartWithPagination
          title="Production Trends (Daily)"
          data={productionData}
          page={productionPage}
          setPage={setProductionPage}
          darkMode={darkMode}
          bars={['maizeProcured', 'maizeFlourProduced']}
          formatNumber={formatNumber}
        />
      </div>
    </div>
  );
};

export default Analytics;
