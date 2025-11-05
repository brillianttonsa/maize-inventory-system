import {  Zap, Droplet, Package, Truck, Users, Settings, PlusCircle, Wallet } from 'lucide-react';



// --- Data Constants ---
export const CATEGORY_COLORS = {
  Electricity: '#FFD700', // Gold
  Water: '#1E90FF',       // Blue
  Sacks: '#10B981',       // Green
  Transport: '#EF4444',   // Red
  Wages: '#8A2BE2',       // Violet
  Maintenance: '#F97316', // Orange
  Other: '#6B7280',       // Gray
};

export const CATEGORIES = [
  { name: 'Electricity', icon: Zap },
  { name: 'Water', icon: Droplet },
  { name: 'Sacks', icon: Package },
  { name: 'Transport', icon: Truck },
  { name: 'Wages', icon: Users },
  { name: 'Maintenance', icon: Settings },
  { name: 'Other', icon: PlusCircle },
];


export const OVERVIEW_ICONS = { Wallet, Zap, Droplet, Package, Truck, Users, Settings };