import api from '../../../services/api'
import { motion } from 'framer-motion'
import { useState } from 'react'

const ProductionCost = ()=> {
    const [productionCostsForm, setProductionCostsForm] = useState({
        date: new Date().toISOString().split("T")[0],
        electricityCost: "",
        transportToFactoryCost: "",
        transportToCustomerCost: "",
        otherCosts: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleProductionCostsChange = (e) => {
        const { name, value } = e.target
            setProductionCostsForm({
            ...productionCostsForm,
            [name]: value,
        })
    }

    const handleProductionCostsSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await api.post("/data-entry/production-costs", {
                date: productionCostsForm.date,
                electricityCost: productionCostsForm.electricityCost,
                transportToFactoryCost: productionCostsForm.transportToFactoryCost,
                transportToCustomerCost: productionCostsForm.transportToCustomerCost,
                otherCosts: productionCostsForm.otherCosts,
            })

            // Reset form after successful submission
            setProductionCostsForm({
                date: new Date().toISOString().split("T")[0],
                electricityCost: "",
                transportToFactoryCost: "",
                transportToCustomerCost: "",
                otherCosts: "",
            })

            alert("Production Costs data saved successfully!")
        } catch (error) {
            console.error("Error saving production costs data:", error)
            alert(error.response?.data?.message || "Failed to save production costs data. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return(
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Production Costs Entry</h3>
          <form onSubmit={handleProductionCostsSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="productionDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="productionDate"
                  name="date"
                  value={productionCostsForm.date}
                  onChange={handleProductionCostsChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="electricityCost" className="block text-sm font-medium text-gray-700 mb-1">
                  Electricity Cost
                </label>
                <input
                  type="number"
                  id="electricityCost"
                  name="electricityCost"
                  value={productionCostsForm.electricityCost}
                  onChange={handleProductionCostsChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="transportToFactoryCost" className="block text-sm font-medium text-gray-700 mb-1">
                  Transport to Factory Cost
                </label>
                <input
                  type="number"
                  id="transportToFactoryCost"
                  name="transportToFactoryCost"
                  value={productionCostsForm.transportToFactoryCost}
                  onChange={handleProductionCostsChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="transportToCustomerCost" className="block text-sm font-medium text-gray-700 mb-1">
                  Transport to Customer Cost
                </label>
                <input
                  type="number"
                  id="transportToCustomerCost"
                  name="transportToCustomerCost"
                  value={productionCostsForm.transportToCustomerCost}
                  onChange={handleProductionCostsChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="otherCosts" className="block text-sm font-medium text-gray-700 mb-1">
                  Other Costs
                </label>
                <input
                  type="number"
                  id="otherCosts"
                  name="otherCosts"
                  value={productionCostsForm.otherCosts}
                  onChange={handleProductionCostsChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Total Production Cost Calculation */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Production Cost:</span>
                <span className="text-xl font-bold text-yellow-600">
                  {(
                    Number.parseFloat(productionCostsForm.electricityCost || 0) +
                    Number.parseFloat(productionCostsForm.transportToFactoryCost || 0) +
                    Number.parseFloat(productionCostsForm.transportToCustomerCost || 0) +
                    Number.parseFloat(productionCostsForm.otherCosts || 0)
                  ).toFixed(2)}/=
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                  isSubmitting ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Saving...
                  </span>
                ) : (
                  "Save Production Costs Entry"
                )}
              </button>
            </div>
          </form>
        </motion.div>
    )

}

export default ProductionCost