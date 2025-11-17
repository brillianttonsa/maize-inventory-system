import {Factory, Package, DollarSign, TrendingUp} from "lucide-react"

export const reportTypes = [
    { 
      id: 1, 
      type: "production",
      title: "Production Report", 
      description: "Detailed production batches, efficiency, and output metrics", 
      icon: Factory, 
      iconColor: "bg-gradient-to-br from-yellow-400 to-amber-500" 
    },
    { 
      id: 2, 
      type: "procurement",
      title: "Procurement Report", 
      description: "Supplier performance, purchase orders, and raw material costs", 
      icon: Package, 
      iconColor: "bg-gradient-to-br from-gray-400 to-gray-600" 
    },
    { 
      id: 3, 
      type: "sales",
      title: "Sales Report", 
      description: "Revenue analysis, customer orders, and distribution metrics", 
      icon: DollarSign, 
      iconColor: "bg-gradient-to-br from-green-400 to-green-600" 
    },
    { 
      id: 4, 
      type: "financial",
      title: "Financial Summary", 
      description: "Comprehensive financial overview including costs and profit margins", 
      icon: TrendingUp, 
      iconColor: "bg-gradient-to-br from-yellow-700 to-amber-900" 
    },
  ];
