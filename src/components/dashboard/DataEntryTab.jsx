import { useState } from "react"
import Sales from "./dashboardComponents/Sales"
import ProductionCost from "./dashboardComponents/productionCost"
import RawMaterial from "./dashboardComponents/RawMaterial"

const DataEntryTab = () => {
  const [activeSection, setActiveSection] = useState("rawMaterials")

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Entry</h2>

      {/* Section Navigation */}
      <div className="flex flex-wrap mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { id: "rawMaterials", label: "Raw Materials", icon: "🌽" },
          { id: "productionCosts", label: "Production Costs", icon: "💰" },
          { id: "sales", label: "Sales", icon: "🛒" },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === section.id
                ? "bg-white text-yellow-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Raw Materials Entry Form */}
      {activeSection === "rawMaterials" && (
        <RawMaterial/>
      )}

      {/* Production Costs Entry Form */}
      {activeSection === "productionCosts" && (
        <ProductionCost/>
      )}

      {/* Sales Entry Form */}
      {activeSection === "sales" && (
        <Sales/>
      )}
    </div>
  )
}

export default DataEntryTab
