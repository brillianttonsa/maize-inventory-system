import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productionService } from '../services/productionApi';
import { queryKeys } from '../services/queryKeys';

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
  const [currentWeek, setCurrentWeek] = useState(0);
  const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const from = toISODate(startDate);
  const to = toISODate(endDate);
  const productionQuery = useQuery({
    queryKey: queryKeys.production.chart(from, to),
    queryFn: () => productionService.getChartData(from, to),
  });

  const data = useMemo(() => {
    const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const grouped = new Map(
      (productionQuery.data ?? []).map((record) => [
        toISODate(record.date),
        { flour: record.flour, bran: record.bran },
      ]),
    );

    return Array.from({ length: endDate.getDate() }, (_, index) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), index + 1);
      const iso = toISODate(date);
      const values = grouped.get(iso) || { flour: 0, bran: 0 };
      return {
        isoDate: iso,
        name: dateLabel(iso),
        flour: values.flour,
        bran: values.bran,
      };
    });
  }, [currentMonth, productionQuery.data]);

  const totalWeeks = Math.ceil(data.length / 7);
  const weekData = data.slice(currentWeek * 7, (currentWeek + 1) * 7);

  const nextWeek = () => {
    if (currentWeek < totalWeeks - 1) setCurrentWeek((prev) => prev + 1);
  };
  const prevWeek = () => {
    if (currentWeek > 0) setCurrentWeek((prev) => prev - 1);
  };

  const prevMonth = () => {
    setCurrentWeek(0);
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentWeek(0);
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return {
    weekData,
    currentMonth,
    currentWeek,
    totalWeeks,
    nextWeek,
    prevWeek,
    prevMonth,
    nextMonth,
    loading: productionQuery.isPending,
    error: productionQuery.isError,
  };
};
