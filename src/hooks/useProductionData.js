import { useState, useEffect } from "react";
import { productionService } from "../services/productionApi";

const toISODate = (d) => {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// REVISED: This function now extracts and returns the day number (date).
const dateLabel = (isoDate) => {
  // We use the ISO date string to correctly create the date object
  const d = new Date(isoDate + "T00:00:00");
  // Get the day of the month (1-31)
  return d.getDate().toString();
};

export const useProductionData = (initialDate = new Date()) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [data, setData] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0); // week index (0 = first week)

  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await productionService.getAll();
        const records = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];

        // Filter to current month
        const monthRecords = records.filter(r => {
          const d = new Date(r.date);
          // Normalize start date to midnight of the first day of the month
          const normalizedStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
          return d >= normalizedStartDate && d <= endDate;
        });

        // Group by date
        const grouped = monthRecords.reduce((acc, item) => {
          const iso = toISODate(item.date);
          if (!acc[iso]) acc[iso] = { flour: 0, bran: 0 };
          acc[iso].flour += Number(item.flour_output || 0);
          acc[iso].bran += Number(item.bran_output || 0);
          return acc;
        }, {});

        // Fill month data
        const dayCount = endDate.getDate();
        const fullMonthData = Array.from({ length: dayCount }, (_, i) => {
          const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
          const iso = toISODate(d);
          const g = grouped[iso] || { flour: 0, bran: 0 };
          return { 
            isoDate: iso, 
            name: dateLabel(iso), // <<< USING THE NEW dateLabel FUNCTION
            flour: g.flour, 
            bran: g.bran 
          };
        });

        setData(fullMonthData);
        setCurrentWeek(0); // reset week to first when month changes
      } catch (err) {
        console.error("Failed to fetch production data:", err);
        setData([]);
      }
    };

    fetchData();
  }, [currentMonth]);

  // Week navigation
  const totalWeeks = Math.ceil(data.length / 7);
  const weekData = data.slice(currentWeek * 7, (currentWeek + 1) * 7);

  const nextWeek = () => {
    if (currentWeek < totalWeeks - 1) setCurrentWeek(prev => prev + 1);
  };
  const prevWeek = () => {
    if (currentWeek > 0) setCurrentWeek(prev => prev - 1);
  };

  const prevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return { weekData, currentMonth, currentWeek, totalWeeks, nextWeek, prevWeek, prevMonth, nextMonth };
};