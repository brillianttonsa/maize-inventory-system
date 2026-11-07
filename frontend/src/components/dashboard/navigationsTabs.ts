import {
  LayoutDashboard,
  Package,
  Factory,
  TrendingUp,
  Paperclip,
  Settings,
  Truck,
  Users,
  Banknote,
  Zap,
  LogOut,
  Brain,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Procurement', href: '/procurement', icon: Truck },
  { name: 'Production', href: '/production', icon: Factory },
  { name: 'Sales', href: '/sales', icon: Users },
  { name: 'Expenses', href: '/expenses', icon: Banknote },
  { name: 'Operational Costs', href: '/operational-costs', icon: Zap },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: Paperclip },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Logout', href: '/', icon: LogOut },
];
