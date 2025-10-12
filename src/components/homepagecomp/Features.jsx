import { Target, Layers, Cpu, BarChart4, Bell, TrendingUp, FileText, Shield, Activity, Globe,  Smartphone, Cloud, Truck, Factory, ShoppingCart, Eye, Clock  } from "lucide-react"; 


export const FeaturesHome = [
    {
      title: "Production Tracking",
      description: "Monitor all stages of maize flour production in real-time.",
      icon: <Activity   />,
    },
    {
      title: "Inventory Management",
      description: "Keep track of raw materials, finished products, and packaging supplies.",
      icon: <BarChart4/>,
    },
    {
      title: "Quality Control",
      description: "Record and analyze quality metrics throughout the production process.",
      icon: <Shield/>,
    },
    {
      title: "AI-Powered Forecasting",
      description: "Predict demand, optimize production schedules, and plan inventory with machine learning algorithms.",
      icon: <TrendingUp/>,
    },
    {
      title: "Automated Reporting",
      description: "Generate detailed reports automatically and schedule them for stakeholders via email or SMS.",
      icon: <FileText/>,
    },
    {
      title: "Smart Alerts & Notifications",
      description: "Get instant notifications about critical events, inventory levels, quality issues, and more.",
      icon: <Bell/>,
    },
    {
      title: "Mobile Responsive",
      description: "Access your data and manage operations from any device, anywhere, anytime.",
      icon: <Smartphone/>,
    },
    {
      title: "Cloud Access & Data Backup",
      description: "Access your data anywhere securely, with automatic backups to prevent data loss.",
      icon: <Cloud/>,
    },
    {
      title: "Global Insights",
      description: "Analyze production, inventory, and market trends from multiple locations.",
      icon: <Globe/>,
    },
]

export const WhatMaizefeatures = [
  {
    id: 1,
    icon: <Target className="w-8 h-8 text-yellow-900" />,
    title: "Purpose-Built",
    description:
      "Designed specifically for maize processing businesses with industry-specific workflows and requirements.",
    delay: 0.2,
  },
  {
    id: 2,
    icon: <Layers className="w-8 h-8 text-yellow-900" />,
    title: "All-in-One",
    description:
      "Manage procurement, production, sales, inventory, and finances all from one integrated platform.",
    delay: 0.4,
  },
  {
    id: 3,
    icon: <Cpu className="w-8 h-8 text-yellow-900" />,
    title: "AI-Powered",
    description:
      "Leverage artificial intelligence for demand forecasting, predictive maintenance, and optimization.",
    delay: 0.6,
  },
];

  
export const modules = [
  {
    icon: <Truck className="w-10 h-10" />,
    title: "Procurement Management",
    description:
      "Streamline your entire procurement process from supplier management to purchase order tracking. Monitor inventory levels, manage supplier relationships, and optimize purchasing decisions with real-time data.",
    color: "from-blue-500 to-blue-600",
    features: [
      "Supplier database and performance tracking",
      "Automated purchase order generation",
      "Real-time inventory monitoring",
      "Cost analysis and budget management",
      "Quality control and inspection tracking",
      "Supplier payment management",
      "Contract management and renewals",
      "Multi-currency support",
    ],
  },
  {
    icon: <Factory className="w-10 h-10" />,
    title: "Production Management",
    description:
      "Optimize your production processes with comprehensive batch tracking, equipment monitoring, and quality assurance. Schedule production runs, track efficiency metrics, and minimize waste with intelligent analytics.",
    color: "from-green-500 to-green-600",
    features: [
      "Batch tracking and traceability",
      "Production scheduling and planning",
      "Compliance and safety monitoring",
    ],
  },
  {
    icon: <ShoppingCart className="w-10 h-10" />,
    title: "Sales & Distribution",
    description:
      "Manage your entire sales pipeline from customer orders to delivery tracking. Analyze sales performance, forecast demand, and optimize pricing strategies with comprehensive sales analytics.",
    color: "from-purple-500 to-purple-600",
    features: [
      "Customer relationship management",
      "Order processing and tracking",
      "Delivery and logistics management",
      "Sales performance analytics",
      "Demand forecasting and planning",
      "Pricing optimization",
      "Invoice and payment tracking",
      "Customer portal and self-service",
    ],
  },
]
  
export const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Increase Revenue",
    description: "Boost revenue by improving production efficiency and optimizing sales processes.",
    stat: "35%",
    statLabel: "Revenue Growth",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Save Time",
    description: "Automate routine tasks and streamline workflows to save valuable time for strategic activities.",
    stat: "40%",
    statLabel: "Time Savings",
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: "Gain Visibility",
    description: "Get complete visibility into your operations with real-time dashboards and reporting.",
    stat: "100%",
    statLabel: "Visibility",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Ensure Compliance",
    description: "Meet industry regulations and quality standards with built-in compliance tracking.",
    stat: "99%",
    statLabel: "Compliance Rate",
  },
];