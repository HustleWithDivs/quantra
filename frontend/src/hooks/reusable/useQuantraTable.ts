import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseQuantraTableOptions {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
  onFetchData: (params: { page: number; search: string; sortKey: string; sortDirection: 'asc' | 'desc' }) => void;
  debounceTime?: number;
}

export const useQuantraTable=({
  totalItems,
  itemsPerPage,
  initialPage = 1,
  onFetchData,
  debounceTime = 400
}: UseQuantraTableOptions)=> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortKey, setSortKey] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, debounceTime);
    return () => clearTimeout(handler);
  }, [searchTerm, debounceTime]);

  useEffect(() => {
    onFetchData({
      page: currentPage,
      search: debouncedSearch,
      sortKey,
      sortDirection
    });
  }, [currentPage, debouncedSearch, sortKey, sortDirection, onFetchData]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((key: string) => {
    setSortDirection((prevDirection) => (sortKey === key && prevDirection === 'asc' ? 'desc' : 'asc'));
    setSortKey(key);
    setCurrentPage(1);
  }, [sortKey]);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
  }, [totalPages]);

  // Builds an accurate windowing range that preserves edges and exposes middle active items
  const paginationRange = useMemo(() => {
    // If total pages fit within bounds, render all of them cleanly without truncation
    if (totalPages <= 6) {
      const range = [];
      for (let i = 1; i <= totalPages; i++) range.push(i);
      return range;
    }

    const leftItems = [1, 2];
    const rightItems = [totalPages - 1, totalPages];

    // Scenario A: Active page is grouped near the start (e.g., page 1, 2, or 3)
    if (currentPage <= 3) {
      return [...leftItems, 3, '...', ...rightItems];
    }

    // Scenario B: Active page is grouped near the end (e.g., n-2, n-1, or n)
    if (currentPage >= totalPages - 2) {
      return [...leftItems, '...', totalPages - 2, ...rightItems];
    }

    // Scenario C: Active page floats in the deep middle, needing ellipsis on both sides
    return [...leftItems, '...', currentPage, '...', ...rightItems];
  }, [totalPages, currentPage]);

  return {
    currentPage,
    searchTerm,
    sortKey,
    sortDirection,
    totalPages,
    paginationRange, 
    handleSearchChange,
    handleSortChange,
    handlePageChange
  };
}
