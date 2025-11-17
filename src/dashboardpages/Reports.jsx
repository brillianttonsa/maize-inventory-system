

// import React from "react";
// import {
//   FileText,
//   Download,
//   Calendar,
//   TrendingUp,
//   Package,
//   DollarSign,
//   Factory,
// } from "lucide-react";

// // --- Custom Yellow Color Palette Classes ---
// const YELLOW_PRIMARY = "text-yellow-600";
// const YELLOW_ACCENT_BG = "bg-yellow-500";
// const YELLOW_ACCENT_HOVER = "hover:bg-yellow-600";
// const YELLOW_ACCENT_RING = "focus:ring-yellow-500";
// const YELLOW_OUTLINE_HOVER = "hover:bg-yellow-50 hover:text-yellow-600";
// const YELLOW_BORDER = "border-yellow-500";
// const MUTED_BG = "bg-gray-50"; // Light neutral background for recent reports

// // --- Utils ---
// const cn = (...classes) => classes.filter(Boolean).join(" ");

// // --- Button Component (Updated for Yellow Primary) ---
// const Button = ({ children, variant = "default", size = "default", className, onClick }) => {
//   const base =
//     "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
//   // Custom Yellow Primary Variant
//   const PRIMARY_VARIANT = `${YELLOW_ACCENT_BG} text-gray-900 ${YELLOW_ACCENT_HOVER} focus:ring-yellow-500 focus:ring-offset-2`;

//   // Update variants to use the yellow primary color
//   const variants = {
//     default: PRIMARY_VARIANT, // Use yellow as default primary
//     destructive: "bg-red-600 text-white hover:bg-red-700",
//     // Outline button uses yellow text/border and light yellow hover
//     outline: `border border-yellow-500 text-yellow-600 bg-white ${YELLOW_OUTLINE_HOVER}`, 
//     secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
//     ghost: `${YELLOW_OUTLINE_HOVER}`,
//     link: "text-yellow-600 underline-offset-4 hover:underline",
//   };
//   const sizes = {
//     default: "h-10 px-4 py-2",
//     sm: "h-9 rounded-md px-3",
//     lg: "h-11 rounded-md px-8",
//     icon: "h-10 w-10",
//   };
//   return (
//     <button
//       className={cn(base, variants[variant], sizes[size], className)}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   );
// };

// // --- Combined Card component ---
// const Card = ({ children, className }) => (
//   // Updated card border color for visual accent
//   <div className={`rounded-lg border bg-white text-gray-900 shadow-md transition-all ${className}`}>
//     {children}
//   </div>
// );

// Card.Header = ({ children, className }) => (
//   <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
// );

// Card.Title = ({ children, className }) => (
//   <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
// );

// Card.Description = ({ children, className }) => (
//   <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
// );

// Card.Content = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

// // --- Reports Page ---
// export default function Reports() {
//   const reportTypes = [
//     {
//       id: 1,
//       title: "Production Report",
//       description: "Detailed production batches, efficiency, and output metrics",
//       icon: Factory,
//       // Custom gradient class for the icon background
//       iconColor: "bg-gradient-to-br from-yellow-400 to-amber-500", 
//     },
//     {
//       id: 2,
//       title: "Procurement Report",
//       description: "Supplier performance, purchase orders, and raw material costs",
//       icon: Package,
//       iconColor: "bg-gradient-to-br from-gray-400 to-gray-600",
//     },
//     {
//       id: 3,
//       title: "Sales Report",
//       description: "Revenue analysis, customer orders, and distribution metrics",
//       icon: DollarSign,
//       iconColor: "bg-gradient-to-br from-green-400 to-green-600",
//     },
//     {
//       id: 4,
//       title: "Financial Summary",
//       description: "Comprehensive financial overview including costs and profit margins",
//       icon: TrendingUp,
//       iconColor: "bg-gradient-to-br from-yellow-700 to-amber-900",
//     },
//   ];

//   const recentReports = [
//     { name: "Production Report - January 2025", date: "2025-02-01", size: "2.4 MB" },
//     { name: "Sales Summary - Q4 2024", date: "2025-01-15", size: "1.8 MB" },
//     { name: "Procurement Analysis - December 2024", date: "2025-01-05", size: "3.1 MB" },
//   ];

//   return (
//     <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      
//       {/* Header */}
//       <div>
//         <h1 className={cn("text-3xl font-bold mb-2", YELLOW_PRIMARY)}>Reports</h1>
//         <p className="text-gray-500">
//           Generate and download comprehensive reports for all operations
//         </p>
//       </div>

//       {/* Quick Actions (Generate Report) */}
//       <Card className="shadow-lg border-l-4 border-yellow-500">
//         <Card.Header>
//           <div className="flex items-center gap-2">
//             {/* Calendar icon now uses yellow primary color */}
//             <Calendar className={cn("h-5 w-5", YELLOW_PRIMARY)} /> 
//             <h3 className="text-xl font-semibold">Generate Custom Report</h3>
//           </div>
//           <p className="text-sm text-gray-500 mt-1">
//             Select date range and report type to generate custom reports
//           </p>
//         </Card.Header>
//         <Card.Content>
//           <div className="flex flex-wrap items-end gap-4">
//             <div className="flex-1 min-w-[180px]">
//               <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
//               <input
//                 type="date"
//                 // Yellow focus ring on input
//                 className={`w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-gray-800 focus:border-yellow-500 focus:ring-1 ${YELLOW_ACCENT_RING}`}
//               />
//             </div>
//             <div className="flex-1 min-w-[180px]">
//               <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
//               <input
//                 type="date"
//                 // Yellow focus ring on input
//                 className={`w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-gray-800 focus:border-yellow-500 focus:ring-1 ${YELLOW_ACCENT_RING}`}
//               />
//             </div>
//             <div className="flex items-end">
//               {/* Primary action button is yellow */}
//               <Button className="gap-2"> 
//                 <Download className="h-4 w-4" />
//                 Generate
//               </Button>
//             </div>
//           </div>
//         </Card.Content>
//       </Card>

//       {/* Report Types */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {reportTypes.map((report) => {
//           const Icon = report.icon;
//           return (
//             // Card with a slight hover effect
//             <Card key={report.id} className="hover:border-yellow-400">
//               <Card.Header>
//                 <div className="flex items-start gap-4">
//                   {/* Colored Icon background */}
//                   <div className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-md ${report.iconColor}`}>
//                     {/* Icon color is white for contrast */}
//                     <Icon className="h-6 w-6 text-white" /> 
//                   </div>
//                   <div className="flex-1">
//                     <Card.Title className={cn("text-xl", YELLOW_PRIMARY)}>{report.title}</Card.Title>
//                     <Card.Description className="mt-2 text-gray-600">{report.description}</Card.Description>
//                   </div>
//                 </div>
//               </Card.Header>
//               <Card.Content>
//                 <div className="flex gap-3">
//                   {/* Outline button uses yellow outline */}
//                   <Button variant="outline" className="flex-1 gap-2"> 
//                     <FileText className="h-4 w-4" />
//                     View Sample
//                   </Button>
//                   {/* Primary button is filled yellow */}
//                   <Button className="flex-1 gap-2"> 
//                     <Download className="h-4 w-4" />
//                     Download
//                   </Button>
//                 </div>
//               </Card.Content>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Recent Reports */}
//       <Card className="shadow-lg border-l-4 border-yellow-500">
//         <Card.Header>
//           <Card.Title className={YELLOW_PRIMARY}>Recent Reports</Card.Title>
//           <Card.Description>Previously generated reports</Card.Description>
//         </Card.Header>
//         <Card.Content>
//           <div className="space-y-3">
//             {recentReports.map((report, idx) => (
//               <div
//                 key={idx}
//                 // Light gray background with yellow hover
//                 className={`flex items-center justify-between p-4 ${MUTED_BG} rounded-lg hover:bg-yellow-100 transition-colors`} 
//               >
//                 <div className="flex items-center gap-3">
//                   {/* File icon uses yellow primary color */}
//                   <FileText className={cn("h-5 w-5", YELLOW_PRIMARY)} /> 
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">{report.name}</p>
//                     <p className="text-xs text-gray-500">
//                       Generated on {report.date} • {report.size}
//                     </p>
//                   </div>
//                 </div>
//                 {/* Ghost button uses yellow hover text */}
//                 <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-yellow-700"> 
//                   <Download className="h-4 w-4" />
//                   Download
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </Card.Content>
//       </Card>
//     </div>
//   );
// }

import { Card } from "../components/dashboardcomponents/reports/Card";
import { ReportTypeCard } from "../components/dashboardcomponents/reports/ReportTypeCard";
import { RecentReports } from "../components/dashboardcomponents/reports/RecentReports";
import { Button } from "../components/dashboardcomponents/reports/Button";
import { Calendar, Factory, Package, DollarSign, TrendingUp, Download } from "lucide-react";

export default function Reports() {
  const reportTypes = [
    { id: 1, title: "Production Report", description: "Detailed production batches, efficiency, and output metrics", icon: Factory, iconColor: "bg-gradient-to-br from-yellow-400 to-amber-500" },
    { id: 2, title: "Procurement Report", description: "Supplier performance, purchase orders, and raw material costs", icon: Package, iconColor: "bg-gradient-to-br from-gray-400 to-gray-600" },
    { id: 3, title: "Sales Report", description: "Revenue analysis, customer orders, and distribution metrics", icon: DollarSign, iconColor: "bg-gradient-to-br from-green-400 to-green-600" },
    { id: 4, title: "Financial Summary", description: "Comprehensive financial overview including costs and profit margins", icon: TrendingUp, iconColor: "bg-gradient-to-br from-yellow-700 to-amber-900" },
  ];

  const recentReports = [
    { name: "Production Report - January 2025", date: "2025-02-01", size: "2.4 MB" },
    { name: "Sales Summary - Q4 2024", date: "2025-01-15", size: "1.8 MB" },
    { name: "Procurement Analysis - December 2024", date: "2025-01-05", size: "3.1 MB" },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 text-yellow-600">Reports</h1>
        <p className="text-gray-500">
          Generate and download comprehensive reports for all operations
        </p>
      </div>

      {/* Generate Report */}
      <Card className="shadow-lg border-l-4 border-yellow-500">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-yellow-600" />
            <h3 className="text-xl font-semibold">Generate Custom Report</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Select date range and report type to generate custom reports
          </p>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500" />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
              <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500" />
            </div>
            <div className="flex items-end">
              <Button className="gap-2">
                <Download className="h-4 w-4" /> Generate
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Report Type Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((r) => (
          <ReportTypeCard key={r.id} {...r} />
        ))}
      </div>

      {/* Recent Reports */}
      <RecentReports reports={recentReports} />
    </div>
  );
}