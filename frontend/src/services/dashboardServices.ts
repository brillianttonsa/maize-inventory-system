import api from './api';
import type { ProductionBatch, Sale } from '../types';

export interface ProductionStats {
  totalMaize: number;
  totalFlour: number;
  totalBran: number;
  efficiency: number | string;
}

export const getProductionStats = async (): Promise<ProductionStats> => {
  try {
    const res = await api.get<ProductionBatch[]>('/production');
    const data = res.data;

    const totalMaize = data.reduce((sum, p) => sum + Number(p.maize_quantity || 0), 0);
    const totalFlour = data.reduce((sum, p) => sum + Number(p.flour_output || 0), 0);
    const totalBran = data.reduce((sum, p) => sum + Number(p.bran_debe_quantity || 0) / 7, 0);

    const efficiency =
      totalMaize > 0 ? ((totalFlour / totalMaize) * 100).toFixed(2) : 0;

    return { totalMaize, totalFlour, totalBran, efficiency };
  } catch (err) {
    console.error('Failed to fetch production stats:', err);
    return { totalMaize: 0, totalFlour: 0, totalBran: 0, efficiency: 0 };
  }
};

export interface RevenueStats {
  totalRevenue: number;
}

export const getRevenueStats = async (): Promise<RevenueStats> => {
  try {
    const res = await api.get<Sale[]>('/sales');
    const data = res.data;

    const totalRevenue = data.reduce((sum, sale) => sum + Number(sale.total_amount || 0), 0);

    return { totalRevenue };
  } catch (err) {
    console.error('Failed to fetch revenue stats:', err);
    return { totalRevenue: 0 };
  }
};
