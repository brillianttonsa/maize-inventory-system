// ---------- Domain entities (match backend response shapes) ----------

export interface Expense {
  id: string;
  user_id: string;
  date: string;
  category: string;
  amount: string;
  unit_value: string | null;
  unit_cost: string | null;
  sack_size: number | null;
  paid_by: string | null;
  method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcurementOrder {
  id: string;
  user_id: string;
  supplier: string;
  quantity: string;
  price_per_kg: string;
  transport_cost: string;
  total_cost: string;
  delivery_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProductionBatch {
  id: string;
  user_id: string;
  maize_quantity: number;
  flour_output: number;
  flour_sacks_5kg: number;
  flour_sacks_10kg: number;
  flour_sacks_25kg: number;
  bran_debe_quantity: string | null;
  bran_unit: 'gunia' | null;
  date: string;
  created_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  customer_name: string;
  customer_contact: string;
  product_type: string;
  quantity: string;
  sack_count: number | null;
  sack_size: number | null;
  bran_debe_quantity: string | null;
  bran_unit_count: string | null;
  bran_unit: 'gunia' | null;
  price_per_kg: string;
  delivery_cost: string;
  delivery_address: string;
  payment_method: string;
  total_amount: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryMovement {
  date: string;
  item: string;
  quantityIn: number;
  quantityOut: number;
  source: string;
  remarks: string;
  balance?: number;
}

export interface RecentActivity {
  date: string;
  remarks: string;
  source: string;
}

// ---------- Reports ----------

export type ReportType = 'production' | 'sales' | 'procurement' | 'financial';

export interface ComprehensiveReport {
  userName: string;
  generatedAt: string;
  production: {
    summary: Record<string, any>;
    batches: ProductionBatch[];
    chartData: Array<{ period: string; [key: string]: any }>;
  };
  sales: {
    summary: Record<string, any>;
    topCustomers: Array<{ name: string; count: number; total: number }>;
    revenueByProduct: Record<string, number>;
    chartData: Array<{ period: string; [key: string]: any }>;
  };
  procurement: {
    summary: Record<string, any>;
    supplierStats: Array<{ name: string; orders: number; totalQuantity: number; totalCost: number }>;
    chartData: Array<{ period: string; [key: string]: any }>;
  };
  expenses: {
    summary: { totalExpenses: number; totalCount: number };
    byCategory: Record<string, number>;
  };
  financial: {
    totalRevenue: number;
    totalExpenses: number;
    totalProcurementCost: number;
    totalCosts: number;
    profit: number;
    profitMargin: string;
  };
  notes: Array<{ type: string; date: string; note: string }>;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
