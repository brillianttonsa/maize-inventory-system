import { useState, useEffect } from 'react';
import { productionService } from '../services/productionApi';
import type { ProductionBatch } from '../types';

interface WeekDataPoint {
  isoDate: string;
  name: string;
  flour: number;
  bran: number;
}

const toISODate = (d: string | Date): string => {
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const dateLabel = (isoDate: string): string => {
  const d = new Date(isoDate + 'T00:00:00');
  return d.getDate().toString();
};

export const useProductionData = (initialDate: Date = new Date()) => {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [data, setData] = useState<WeekDataPoint[]>([]);
  const [currentWeek, setCurrentWeek] = useState(0);

  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: ProductionBatch[] = await productionService.getAll();
        const records = Array.isArray(res) ? res : [];

        const monthRecords = records.filter((r) => {
          const d = new Date(r.date);
          const normalizedStartDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
          );
          return d >= normalizedStartDate && d <= endDate;
        });

        const grouped = monthRecords.reduce<Record<string, { flour: number; bran: number }>>(
          (acc, item) => {
            const iso = toISODate(item.date);
            if (!acc[iso]) acc[iso] = { flour: 0, bran: 0 };
            acc[iso].flour += Number(item.flour_output || 0);
            acc[iso].bran += Number(item.bran_debe_quantity || 0) / 7;
            return acc;
          },
          {},
        );

        const dayCount = endDate.getDate();
        const fullMonthData: WeekDataPoint[] = Array.from({ length: dayCount }, (_, i) => {
          const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
          const iso = toISODate(d);
          const g = grouped[iso] || { flour: 0, bran: 0 };
          return {
            isoDate: iso,
            name: dateLabel(iso),
            flour: g.flour,
            bran: g.bran,
          };
        });

        setData(fullMonthData);
        setCurrentWeek(0);
      } catch (err) {
        console.error('Failed to fetch production data:', err);
        setData([]);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const totalWeeks = Math.ceil(data.length / 7);
  const weekData = data.slice(currentWeek * 7, (currentWeek + 1) * 7);

  const nextWeek = () => {
    if (currentWeek < totalWeeks - 1) setCurrentWeek((prev) => prev + 1);
  };
  const prevWeek = () => {
    if (currentWeek > 0) setCurrentWeek((prev) => prev - 1);
  };

  const prevMonth = () =>
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  return { weekData, currentMonth, currentWeek, totalWeeks, nextWeek, prevWeek, prevMonth, nextMonth };
};
