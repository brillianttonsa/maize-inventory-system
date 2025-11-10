import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,  Cell, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function StockCharts({ stockLevels }) {
  return (

       <div className="p-6 rounded-xl shadow-2xl bg-white lg:col-span-2">
        <h3 className="text-lg font-bold mb-4 text-yellow-700">Stock Level Trends (kg/units)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockLevels}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value">
              {stockLevels.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
  );
}
