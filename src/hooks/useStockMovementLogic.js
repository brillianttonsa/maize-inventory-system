import { useState, useMemo } from "react";

export default function useStockMovement(movements, rowsPerPage = 7) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterItem, setFilterItem] = useState("All");
  const [filterSource, setFilterSource] = useState("All");

  // ✅ Filter logic
  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const itemMatch =
        filterItem === "All" || m.item?.toLowerCase() === filterItem.toLowerCase();
      const sourceMatch =
        filterSource === "All" ||
        (m.source || m.destination || "").toLowerCase() === filterSource.toLowerCase();
      return itemMatch && sourceMatch;
    });
  }, [movements, filterItem, filterSource]);

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredMovements.length / rowsPerPage);

  const paginatedMovements = useMemo(() => {
    return filteredMovements
      .slice()
      .reverse()
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredMovements, currentPage, rowsPerPage]);

  const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  const handleFilterChange = (e, type) => {
    if (type === "item") setFilterItem(e.target.value);
    else if (type === "source") setFilterSource(e.target.value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    filterItem,
    filterSource,
    filteredMovements,
    paginatedMovements,
    handlePrev,
    handleNext,
    handleFilterChange,
  };
}
