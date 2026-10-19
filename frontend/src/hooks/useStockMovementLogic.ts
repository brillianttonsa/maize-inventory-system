import { useState, type ChangeEvent } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { inventoryService } from '../services/inventoryService';
import { queryKeys } from '../services/queryKeys';

export default function useStockMovement(rowsPerPage = 7) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterItem, setFilterItem] = useState('All');
  const [filterSource, setFilterSource] = useState('All');
  const movementQuery = useQuery({
    queryKey: queryKeys.inventory.movementPage(
      currentPage,
      rowsPerPage,
      filterItem,
      filterSource,
    ),
    queryFn: () =>
      inventoryService.getMovementPage(currentPage, rowsPerPage, filterItem, filterSource),
    placeholderData: keepPreviousData,
  });
  const paginatedMovements = movementQuery.data?.items ?? [];
  const totalPages = movementQuery.data?.totalPages ?? 0;

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
    filteredMovements: paginatedMovements,
    paginatedMovements,
    totalRecords: movementQuery.data?.total ?? 0,
    loading: movementQuery.isPending,
    error: movementQuery.isError,
    handlePrev,
    handleNext,
    handleFilterChange,
  };
}
