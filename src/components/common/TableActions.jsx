import { Pencil, Trash2 } from 'lucide-react';

const TableActions = ({ item, handleEdit, handleDelete }) => {
  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleEdit(item)} 
        title="Edit"
        className="text-blue-500 hover:text-blue-700 p-1 rounded-full transition-colors duration-150"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button 
        onClick={() => handleDelete(item.id)} 
        title="Delete"
        className="text-red-500 hover:text-red-700 p-1 rounded-full transition-colors duration-150"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TableActions;