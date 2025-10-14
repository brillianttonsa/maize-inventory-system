


import { useState, useEffect } from "react"
import api from "../services/api"

// Pagination component
// Pagination component (unchanged)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  for (let i = 1; i <= totalPages; i++) pages.push(i)

  return (
    <div className="flex justify-center mt-4 gap-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}


const Production = () => {
  const darkMode = false
  const [formData, setFormData] = useState({
    maizeQuantity: "",
    flourOutput: "",
    branOutput: "",
    waterUsage: "",
    electricityUsage: "",
    sacksUsed: "",
    employeeNotes: "",
   
  })

  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 5

  // Fetch production batches from backend
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await api.get("/production")

        const formatted = res.data.map((item) => ({
          id: item.id,
          maizeQuantity: item.maize_quantity,
          flourOutput: item.flour_output,
          branOutput: item.bran_output,
          waterUsage: item.water_usage,
          electricityUsage: item.electricity_usage,
          sacksUsed: item.sacks_used,
          employeeNotes: item.employee_notes,
          date: item.date
        }));

        setBatches(formatted)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchBatches()
  }, [])

  const totalPages = Math.ceil(batches.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const currentBatches = batches.slice(startIndex, startIndex + rowsPerPage)

  const handleChange = (e) => {
    const { name, value } = e.target

    // Limit employeeNotes to 7 words
    if (name === "employeeNotes") {
      const words = value.trim().split(/\s+/).filter(Boolean)
      if (words.length > 5) {
        const trimmed = words.slice(0, 5).join(" ")
        setFormData((prev) => ({ ...prev, [name]: trimmed }))
        return
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        maizeQuantity: Number(formData.maizeQuantity),
        flourOutput: Number(formData.flourOutput),
        branOutput: Number(formData.branOutput),
        waterUsage: Number(formData.waterUsage),
        electricityUsage: Number(formData.electricityUsage),
        sacksUsed: Number(formData.sacksUsed),
        employeeNotes: formData.employeeNotes,
      }
  
      const res = await api.post("/production", payload)
  
      // Map backend snake_case to frontend camelCase
      const newBatch = {
        id: res.data.id,
        maizeQuantity: res.data.maize_quantity,
        flourOutput: res.data.flour_output,
        branOutput: res.data.bran_output,
        waterUsage: res.data.water_usage,
        electricityUsage: res.data.electricity_usage,
        sacksUsed: res.data.sacks_used,
        employeeNotes: res.data.employee_notes,
        date: res.data.date, // already YYYY-MM-DD
      }
  
      setBatches([...batches, newBatch])

  
      setFormData({
        maizeQuantity: "",
        flourOutput: "",
        branOutput: "",
        waterUsage: "",
        electricityUsage: "",
        sacksUsed: "",
        employeeNotes: "",
      })
    } catch (err) {
      console.error(err)
      alert("Failed to save production batch.")
    }
  }
  

  const handleDelete = async (id) => {
    try {
      await api.delete(`/production/${id}`)
      setBatches(batches.filter((b) => b.id !== id))
    } catch (err) {
      console.error(err)
      alert("Failed to delete batch.")
    }
  }

  const handleEdit = (batch) => {
    setFormData({
      batchNumber: batch.batchNumber,
      maizeQuantity: batch.maizeQuantity,
      flourOutput: batch.flourOutput,
      branOutput: batch.branOutput,
      waterUsage: batch.waterUsage,
      electricityUsage: batch.electricityUsage,
      sacksUsed: batch.sacksUsed,
      employeeNotes: batch.employeeNotes,
      startTime: batch.startTime,
      endTime: batch.endTime,
    })
    setBatches(batches.filter((b) => b.id !== batch.id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="lg:col-span-1">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-semibold mb-4">Record Production</h3>
          <form onSubmit={handleSubmit}>
            
            

            {/* Maize & Flour */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Maize Input (kg)
                </label>
                <input
                  type="number"
                  name="maizeQuantity"
                  value={formData.maizeQuantity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                  Flour Output (kg)
                </label>
                <input
                  type="number"
                  name="flourOutput"
                  value={formData.flourOutput}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>
            </div>

            {/* Bran & Water */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Bran Output (kg)</label>
                <input type="number" name="branOutput" value={formData.branOutput} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Water Usage (L)</label>
                <input type="number" name="waterUsage" value={formData.waterUsage} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>
            </div>

            {/* Electricity & Sacks */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Electricity (kWh)</label>
                <input type="number" name="electricityUsage" value={formData.electricityUsage} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Sacks Used</label>
                <input type="number" name="sacksUsed" value={formData.sacksUsed} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"}`} required />
              </div>
            </div>


            {/* Employee Notes */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Employee Notes (max 5 words)</label>
              <textarea
                name="employeeNotes"
                value={formData.employeeNotes}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300"
                }`}
              ></textarea>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {formData.employeeNotes.trim().split(/\s+/).filter(Boolean).length}/5 words
              </p>
            </div>

            <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Record Production
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      {/* (rest of table unchanged) */}
      {/* ... */}
      <div className="lg:col-span-2">
        <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className="text-lg font-semibold mb-4">Production Batches</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Batch</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Maize Input</th>
<th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Outputs</th>

                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Resources</th>
                  
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Notes</th>
                  <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
                </tr>
              </thead>

              <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : currentBatches.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">No production batches yet.</td>
                  </tr>
                ) : (
                  currentBatches.map((batch, index) => (
                    <tr key={batch.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
  <div className="font-medium">{startIndex + index + 1}</div>
  <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{batch.date.slice(0, 10)}</div>
</td>

<td className="px-4 py-4 whitespace-nowrap">
  <div className="text-sm">Maize Input: {batch.maizeQuantity}kg</div>
</td>
<td className="px-4 py-4 whitespace-nowrap">
  <div className="text-sm">
    <div>Flour Output: {batch.flourOutput}kg</div>
    <div>Bran Output: {batch.branOutput}kg</div>
  </div>
</td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div>Water: {batch.waterUsage}L</div>
                          <div>Power: {batch.electricityUsage}kWh</div>
                          <div>Sacks: {batch.sacksUsed}</div>
                        </div>
                      </td>
                     
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm">{batch.employeeNotes}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(batch)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">Edit</button>
                          <button onClick={() => handleDelete(batch.id)} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Production

