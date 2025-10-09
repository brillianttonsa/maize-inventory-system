import { Target, Layers, Cpu, BarChart4, Bell, TrendingUp, FileText, Shield, Activity, Globe,  Smartphone, Cloud  } from "lucide-react"; 

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

  
  
