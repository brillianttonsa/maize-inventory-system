
const TablePagination = ({ currentPage, totalPages, paginate }) => {
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            currentPage === i + 1 
              ? "bg-yellow-500 text-white shadow-md" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}>
            {i + 1}
          </button>
        ))}
      </div>
    )
  }
  
  export default TablePagination