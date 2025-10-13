"use client";

import React from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  Factory,
} from "lucide-react";

// --- Utils ---
const cn = (...classes) => classes.filter(Boolean).join(" ");

// --- Button Component ---
const Button = ({ children, variant = "default", size = "default", className, onClick }) => {
  const base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// --- Combined Card component ---
const Card = ({ children, className }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

Card.Header = ({ children, className }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

Card.Title = ({ children, className }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

Card.Description = ({ children, className }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

Card.Content = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

// --- Reports Page ---
export default function Reports() {
  const reportTypes = [
    {
      id: 1,
      title: "Production Report",
      description: "Detailed production batches, efficiency, and output metrics",
      icon: Factory,
      iconColor: "bg-gradient-primary",
    },
    {
      id: 2,
      title: "Procurement Report",
      description: "Supplier performance, purchase orders, and raw material costs",
      icon: Package,
      iconColor: "bg-gradient-secondary",
    },
    {
      id: 3,
      title: "Sales Report",
      description: "Revenue analysis, customer orders, and distribution metrics",
      icon: DollarSign,
      iconColor: "bg-gradient-accent",
    },
    {
      id: 4,
      title: "Financial Summary",
      description: "Comprehensive financial overview including costs and profit margins",
      icon: TrendingUp,
      iconColor: "bg-success",
    },
  ];

  const recentReports = [
    { name: "Production Report - January 2025", date: "2025-02-01", size: "2.4 MB" },
    { name: "Sales Summary - Q4 2024", date: "2025-01-15", size: "1.8 MB" },
    { name: "Procurement Analysis - December 2024", date: "2025-01-05", size: "3.1 MB" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Reports</h1>
        <p className="text-muted-foreground">
          Generate and download comprehensive reports for all operations
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md">
        <Card.Header>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">Generate Report</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Select date range and report type to generate custom reports
          </p>
        </Card.Header>
        <Card.Content>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-foreground mb-2 block">Start Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-foreground mb-2 block">End Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-foreground"
              />
            </div>
            <div className="flex items-end">
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className="shadow-md hover:shadow-lg transition-shadow">
              <Card.Header>
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${report.iconColor}`}>
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <Card.Title className="text-xl">{report.title}</Card.Title>
                    <Card.Description className="mt-2">{report.description}</Card.Description>
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" />
                    View Sample
                  </Button>
                  <Button className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
      <Card className="shadow-md">
        <Card.Header>
          <Card.Title>Recent Reports</Card.Title>
          <Card.Description>Previously generated reports</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="space-y-3">
            {recentReports.map((report, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{report.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Generated on {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
