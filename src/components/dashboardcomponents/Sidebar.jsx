import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Factory, 
  TrendingUp, 
  Wheat, 
  Paperclip,
  Settings,
  Menu,
  X,
  Package,
  Truck,
  Users,
  Banknote,
  LogOut,
} from "lucide-react";
import { navigationItems } from "./navigationsTabs";

export default function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //Function to get the current page title
  const currentPage = navigationItems.find(
    (item) => item.href === location.pathname
  );
  const pageTitle = currentPage ? currentPage.name : "MFMS System";

  return (
    <div className="h-screen bg-background flex flex-col">
      
     
      <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-200">
        <div 
          
          className="flex h-full items-center justify-between px-4"
        >
            
            {/* Left Side: Mobile Menu Button (SM) / Empty Spacer (MD+) */}
            <div className="flex items-center">
                {/* Mobile Menu Button: Only visible on small screens */}
                <button
                    className="text-black p-2 rounded-md hover:bg-gray-100 md:hidden"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Center: The Title (Visible on ALL screens) */}
            <div className="flex-1 flex justify-center md:justify-start md:ml-64">
                <h2 
                    
                    className="text-xl font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis"
                >
                    {pageTitle}
                </h2>
            </div>
            
            
        </div>
      </header>


      <div className="flex flex-1 overflow-hidden">
        {/* 2. Mobile Backdrop/Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30  bg-opacity-30 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}


        <aside
          className={`fixed top-0 left-0 z-40 h-screen w-64 bg-black text-white border-r border-gray-800 transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        >
          <div className="flex h-full flex-col">
            
      
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

  
              <button
                className="md:hidden text-gray-400 hover:text-white"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

       
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
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

        
            <div className="border-t border-gray-800 p-4">
              <p className="text-xs text-gray-500 text-center">
                © 2025 MFMS. All rights reserved.
              </p>
            </div>
          </div>
        </aside>

        
        <main className="flex-1 overflow-y-auto p-6 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}