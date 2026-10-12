import { DollarSign, Archive, Package, type LucideIcon } from 'lucide-react';

export interface KPITotals {
  totalSales: number;
  totalCosts: number;
}

export interface KPIDatum {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface GetKPIDataArgs {
  totals: KPITotals;
  maize: number;
  flour: number;
  bran: number;
}

export const getKPIData = ({ totals, maize, flour, bran }: GetKPIDataArgs): KPIDatum[] => {
  return [
    {
      title: 'Total Revenue',
      value: `Tsh ${totals.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Cost',
      value: `Tsh ${totals.totalCosts.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-red-500',
    },
    {
      title: 'Total Maize Received',
      value: `${maize.toLocaleString()} kg`,
      icon: Archive,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Flour Produced',
      value: `${flour.toLocaleString()} kg`,
      icon: Package,
      color: 'bg-orange-500',
    },
    {
      title: 'Total Bran Produced',
      value: `${bran.toLocaleString()} gunia`,
      icon: Package,
      color: 'bg-purple-500',
    },
  ];
};
