import { useState, useMemo, type ChangeEvent } from 'react';
import type { InventoryMovement } from '../types';

export default function useStockMovement(movements: InventoryMovement[], rowsPerPage = 7) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterItem, setFilterItem] = useState('All');
  const [filterSource, setFilterSource] = useState('All');

  const filteredMovements = useMemo(() => {
    return movements.filter((m) => {
      const itemMatch = filterItem === 'All' || m.item?.toLowerCase() === filterItem.toLowerCase();
      const sourceMatch =
        filterSource === 'All' || (m.source || '').toLowerCase() === filterSource.toLowerCase();
      return itemMatch && sourceMatch;
    });
  }, [movements, filterItem, filterSource]);

  const totalPages = Math.ceil(filteredMovements.length / rowsPerPage);

  const paginatedMovements = useMemo(() => {
    return filteredMovements.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  }, [filteredMovements, currentPage, rowsPerPage]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>, type: 'item' | 'source') => {
    if (type === 'item') setFilterItem(e.target.value);
    else if (type === 'source') setFilterSource(e.target.value);
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
