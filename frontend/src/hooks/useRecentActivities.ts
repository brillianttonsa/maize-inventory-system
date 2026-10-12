import { useState, useEffect } from 'react';
import { Truck, Factory, ShoppingCart, DollarSign, Circle, type LucideIcon } from 'lucide-react';
import { getRecentActivities } from '../services/activityService';

export interface MappedActivity {
  id: number;
  type: string;
  description: string;
  user: string;
  time: string;
  IconComponent: LucideIcon;
}

export default function useRecentActivities() {
  const [activities, setActivities] = useState<MappedActivity[]>([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities();

        const mapped: MappedActivity[] = data.map((item, index) => {
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
        });

        setActivities(mapped);
      } catch (err) {
        console.error('Failed to fetch activities:', err);
      }
    };

    fetchActivities();
  }, []);

  return activities;
}
