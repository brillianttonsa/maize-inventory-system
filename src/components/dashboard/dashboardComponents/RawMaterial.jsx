import api from '../../../services/api'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const RawMaterial = () => {
    const [rawMaterialsForm, setRawMaterialsForm] = useState({
      date: new Date().toISOString().split("T")[0],
      quantity: "",
      costPerTon: "",
      supplier: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleRawMaterialsChange = (e) => {
        const { name, value } = e.target
        setRawMaterialsForm({
        ...rawMaterialsForm,
        [name]: value,
        })
    }


    const handleRawMaterialsSubmit = async (e) => {
      e.preventDefault()
      setIsSubmitting(true)

      try {
        const response = await api.post("/data-entry/raw-materials", {
          date: rawMaterialsForm.date,
          quantity: rawMaterialsForm.quantity,
          costPerTon: rawMaterialsForm.costPerTon,
          supplier: rawMaterialsForm.supplier,
        })

        // Reset form after successful submission
        setRawMaterialsForm({
          date: new Date().toISOString().split("T")[0],
          quantity: "",
          costPerTon: "",
          supplier: "",
        })

        alert("Raw Materials data saved successfully!")
      } catch (error) {
        console.error("Error saving raw materials data:", error)
        alert(error.response?.data?.message || "Failed to save raw materials data. Please try again.")
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
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Raw Materials Entry</h3>
            <form onSubmit={handleRawMaterialsSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={rawMaterialsForm.date}
                    onChange={handleRawMaterialsChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Maize Quantity (tons)
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={rawMaterialsForm.quantity}
                    onChange={handleRawMaterialsChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="costPerTon" className="block text-sm font-medium text-gray-700 mb-1">
                    Cost per Ton
                  </label>
                  <input
                    type="number"
                    id="costPerTon"
                    name="costPerTon"
                    value={rawMaterialsForm.costPerTon}
                    onChange={handleRawMaterialsChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    id="supplier"
                    name="supplier"
                    value={rawMaterialsForm.supplier}
                    onChange={handleRawMaterialsChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              {/* Total Cost Calculation */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Total Cost:</span>
                  <span className="text-xl font-bold text-yellow-600">
                    
                    {rawMaterialsForm.quantity && rawMaterialsForm.costPerTon
                      ? (
                          Number.parseFloat(rawMaterialsForm.quantity) * Number.parseFloat(rawMaterialsForm.costPerTon)
                        ).toFixed(2)
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
                    <span>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Saving...
                    </span>
                  ) : (
                    "Save Raw Materials Entry"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )
}

export default RawMaterial