import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductionData } from "../../../hooks/useProductionData";

const ProductionChart = () => {
  const { weekData, currentMonth, currentWeek, totalWeeks, nextWeek, prevWeek, prevMonth, nextMonth } = useProductionData();

  // --- Style Variables (Matching your yellow theme) ---
  // Smaller button size (p-1.5 vs p-2) and text (text-xs vs text-sm)
  const primaryColor = "bg-yellow-500 hover:bg-yellow-600 text-white";
  const secondaryColor = "bg-yellow-100 hover:bg-yellow-200 text-yellow-800";
  const disabledStyles = "disabled:opacity-50 disabled:cursor-not-allowed";
  const buttonBaseStyles = "rounded-md font-medium transition-colors flex items-center justify-center p-1.5 text-xs"; // Smaller size

  return (
    <div className="space-y-4 border rounded shadow-xl p-4 border-yellow-200">
      
      {/* 1. Month Label (Moved to the top where it belongs) */}
      <div className="text-center pb-2">
        <h3 className="text-lg font-bold text-gray-800">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })} Production
        </h3>
      </div>
      
      {/* 2. Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weekData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fill: "#4b5563" }} />
          <YAxis 
            tick={{ fill: "#4b5563" }} 
            label={{ value: "kg", angle: -90, position: "insideLeft", fill: "#4b5563" }} 
          />
          <Tooltip 
            formatter={(v, name) => [`${v} kg`, name]} 
            contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e7eb", color: "#4b5563", borderRadius: "4px" }}
          />
          <Legend wrapperStyle={{ paddingTop: "10px" }} />
          
          <Bar dataKey="flour" name="Flour" fill="#FBBF24" /> 
          <Bar dataKey="bran" name="Bran" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
      
      {/* 3. Navigation Controls (Small and placed down) */}
      <div className="flex justify-between items-end pt-2 border-t border-gray-200">
        
        {/* Week Navigation Group */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevWeek} 
            disabled={currentWeek === 0} 
            className={`${buttonBaseStyles} ${secondaryColor} ${disabledStyles} w-16`}
            title="Previous Week"
          >
            <ChevronLeft className="h-3 w-3" /> Prev
          </button>
          
          <span className="font-semibold text-xs text-yellow-900">
            Wk {currentWeek + 1} / {totalWeeks}
          </span>
          
          <button 
            onClick={nextWeek} 
            disabled={currentWeek === totalWeeks - 1} 
            className={`${buttonBaseStyles} ${secondaryColor} ${disabledStyles} w-16`}
            title="Next Week"
          >
            Next <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        
        {/* Month Navigation Group */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={prevMonth} 
            className={`${buttonBaseStyles} ${primaryColor}`}
            title="Previous Month"
          >
            <ChevronLeft className="h-3 w-3" /> Month
          </button>
          
          <button 
            onClick={nextMonth} 
            className={`${buttonBaseStyles} ${primaryColor}`}
            title="Next Month"
          >
            Month <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionChart;