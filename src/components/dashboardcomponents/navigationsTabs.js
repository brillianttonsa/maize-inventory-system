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
  LogOut,
  Brain,
} from "lucide-react"

export const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Procurement", href: "/procurement", icon: Truck },
  { name: "Production", href: "/production", icon: Factory },
  { name: "Sales", href: "/sales", icon: Users },
  { name: "Expenses", href: "/expenses", icon: Banknote },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "AI Analytics", href: "/ai-analytics", icon: Brain },
  { name: "Reports", href: "/reports", icon: Paperclip },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Logout", href: "/login", icon: LogOut },
]
