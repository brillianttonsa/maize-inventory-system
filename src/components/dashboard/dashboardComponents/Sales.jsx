import api from '../../../services/api'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'


const Sales = () => {
    const [salesForm, setSalesForm] = useState({
        date: new Date().toISOString().split("T")[0],
        flourQuantity: "",
        pricePerTon: "",
        customer: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)


    const handleSalesChange = (e) => {
        const { name, value } = e.target
        setSalesForm({
        ...salesForm,
        [name]: value,
        })
    }

    
    const handleSalesSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
        const response = await api.post("/data-entry/sales", {
            date: salesForm.date,
            flourQuantity: salesForm.flourQuantity,
            pricePerTon: salesForm.pricePerTon,
            customer: salesForm.customer,
        })

        // Reset form after successful submission
        setSalesForm({
            date: new Date().toISOString().split("T")[0],
            flourQuantity: "",
            pricePerTon: "",
            customer: "",
        })

        alert("Sales data saved successfully!")
        } catch (error) {
        console.error("Error saving sales data:", error)
        alert(error.response?.data?.message || "Failed to save sales data. Please try again.")
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
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Sales Entry</h3>
          <form onSubmit={handleSalesSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salesDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="salesDate"
                  name="date"
                  value={salesForm.date}
                  onChange={handleSalesChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="flourQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Flour Quantity (tons)
                </label>
                <input
                  type="number"
                  id="flourQuantity"
                  name="flourQuantity"
                  value={salesForm.flourQuantity}
                  onChange={handleSalesChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="pricePerTon" className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Ton
                </label>
                <input
                  type="number"
                  id="pricePerTon"
                  name="pricePerTon"
                  value={salesForm.pricePerTon}
                  onChange={handleSalesChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <input
                  type="text"
                  id="customer"
                  name="customer"
                  value={salesForm.customer}
                  onChange={handleSalesChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>

            {/* Total Sales Calculation */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Sales:</span>
                <span className="text-xl font-bold text-green-600">
                  {salesForm.flourQuantity && salesForm.pricePerTon
                    ? (Number.parseFloat(salesForm.flourQuantity) * Number.parseFloat(salesForm.pricePerTon)).toFixed(2)
                    : "0.00"}/=
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
                  "Save Sales Entry"
                )}
              </button>
            </div>
          </form>
        </motion.div>
    )
}

export default Sales