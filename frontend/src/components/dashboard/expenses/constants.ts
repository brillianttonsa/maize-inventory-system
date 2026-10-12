import type { LucideIcon } from 'lucide-react';
import { Zap, Droplet, Package, Truck, Users, Settings, PlusCircle, Wallet } from 'lucide-react';

export const CATEGORY_COLORS: Record<string, string> = {
  Electricity: '#FFD700',
  Water: '#1E90FF',
  Sacks: '#10B981',
  Transport: '#EF4444',
  Wages: '#8A2BE2',
  Maintenance: '#F97316',
  Other: '#6B7280',
};

export interface CategoryDef {
  name: string;
  icon: LucideIcon;
}

export const CATEGORIES: CategoryDef[] = [
  { name: 'Electricity', icon: Zap },
  { name: 'Water', icon: Droplet },
  { name: 'Sacks', icon: Package },
  { name: 'Transport', icon: Truck },
  { name: 'Wages', icon: Users },
  { name: 'Maintenance', icon: Settings },
  { name: 'Other', icon: PlusCircle },
];

export const OVERVIEW_ICONS: Record<string, LucideIcon> = {
  Wallet,
  Zap,
  Droplet,
  Package,
  Truck,
  Users,
  Settings,
};
