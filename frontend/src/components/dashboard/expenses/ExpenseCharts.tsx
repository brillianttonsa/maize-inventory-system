import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CategoryChartDatum {
  name: string;
  amount: number;
  fill: string;
}

interface ExpenseChartsProps {
  categoryChartData: CategoryChartDatum[];
}

const ExpenseCharts = ({ categoryChartData }: ExpenseChartsProps) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="grid gap-6">
        <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-white border border-yellow-200">
          <h3 className="text-lg font-bold mb-4 text-yellow-700">Category Breakdown </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categoryChartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Amount (Tsh)']} />
              <Legend layout="horizontal" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-xl shadow-lg bg-white border border-yellow-200">
        <h3 className="text-lg font-bold mb-4 text-yellow-700">Category Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => val} />
            <Tooltip formatter={(value) => [value, 'Amount (Tsh)']} />
            <Legend />
            <Bar dataKey="amount" name="Expense Amount (TSh)">
              {categoryChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseCharts;
