import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Truck, Factory, ShoppingCart, DollarSign, Circle, type LucideIcon } from 'lucide-react';
import { getRecentActivities } from '../services/activityService';
import { queryKeys } from '../services/queryKeys';

export interface MappedActivity {
  id: number;
  type: string;
  description: string;
  user: string;
  time: string;
  IconComponent: LucideIcon;
}

export default function useRecentActivities() {
  const activitiesQuery = useQuery({
    queryKey: queryKeys.activities.recent,
    queryFn: getRecentActivities,
  });
  const activities = useMemo(
    () =>
      (activitiesQuery.data ?? []).map((item, index): MappedActivity => {
        const IconComponent =
          item.source === 'Procurement'
            ? Truck
            : item.source === 'Production'
              ? Factory
              : item.source === 'Sales'
                ? ShoppingCart
                : item.source === 'Expense'
                  ? DollarSign
                  : Circle;

        return {
          id: index,
          type: item.source.toLowerCase(),
          description: item.remarks,
          user: 'You',
          time: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          IconComponent,
        };
      }),
    [activitiesQuery.data],
  );

  return {
    activities,
    loading: activitiesQuery.isPending,
    error: activitiesQuery.isError,
  };
}
