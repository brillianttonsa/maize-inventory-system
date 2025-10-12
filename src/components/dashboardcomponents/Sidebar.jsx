import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Factory, 
  TrendingUp, 
  Users,
  Wheat, 
  Paperclip,
  Settings,
  Menu,
  X
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Procurement", href: "/procurement", icon: ShoppingCart },
  { name: "Production", href: "/production", icon: Factory },
  { name: "Sales", href: "/sales", icon: Users },
  { name: "Analytics", href: "/analytics", icon: TrendingUp },
  { name: "Reports", href: "/reports", icon: Paperclip },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Logout", href: "/logout", icon: Users }
];

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-black text-white border-r border-gray-800 transform transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between gap-3 border-b border-gray-800 px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-600">
                <Wheat className="h-6 w-6 text-gray-800" />
              </div>
              <div>
                <h1 className="text-lg font-bold">MFMS</h1>
                <p className="text-xs text-gray-400">Production System</p>
              </div>
            </div>

            {/* Close Button (mobile only) */}
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              const linkClass = `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-yellow-500 text-black shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={linkClass}
                  onClick={() => setSidebarOpen(false)} // close sidebar on mobile when a link is clicked
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <p className="text-xs text-gray-500 text-center">
              © 2025 MFMS. All rights reserved.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-600 text-black p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
