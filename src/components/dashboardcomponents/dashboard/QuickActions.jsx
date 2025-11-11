import { motion } from "framer-motion"
import { Plus, Package, Factory, ShoppingCart, FileText, BarChart3 } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function QuickActions() {
  const navigate = useNavigate()

  const actions = [
    {
      id: 1,
      title: "New Order",
      description: "Place maize order",
      icon: Plus,
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      onClick: () => navigate("/procurement"),
    },
    {
      id: 2,
      title: "Start Production",
      description: "Begin new batch",
      icon: Factory,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      onClick: () => navigate("/production"),
    },
    {
      id: 3,
      title: "Record Sale",
      description: "Add new sale",
      icon: ShoppingCart,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      onClick: () => navigate("/sales"),
    },
    {
      id: 4,
      title: "Generate Report",
      description: "Create report",
      icon: FileText,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      onClick: () => navigate("/reports"),
    },
    {
      id: 5,
      title: "Inventory",
      description: "Check stock levels",
      icon: Package,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      onClick: () => navigate("/inventory"),
    },
    {
      id: 6,
      title: "Analytics",
      description: "View insights",
      icon: BarChart3,
      color: "bg-pink-500",
      hoverColor: "hover:bg-pink-600",
      onClick: () => navigate("/analytics"),
    },
  ]

  return (
    <div className="p-6 rounded-xl shadow-lg bg-white border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className={`p-4 rounded-xl ${action.color} ${action.hoverColor} text-white transition-all duration-200 shadow-md hover:shadow-xl group`}
          >
            <action.icon className="h-6 w-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
            <p className="text-sm font-medium">{action.title}</p>
            <p className="text-xs opacity-90 mt-1">{action.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
