
import { Pencil, Trash2 } from "lucide-react"

const TableActions = ({ order, handleEdit, handleDelete }) => {
  return (
    <div className="flex space-x-2">
      <button className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-gray-100" onClick={() => handleEdit(order)} title="Edit">
        <Pencil className="h-4 w-4" />
      </button>
      <button className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-gray-100" onClick={() => handleDelete(order.id)} title="Delete">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export default TableActions