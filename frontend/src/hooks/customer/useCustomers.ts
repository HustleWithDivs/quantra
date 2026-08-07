import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { customerApi, type Customer } from '../../api/customerApi';
import { getCustomerTableColumns } from '../../utilities/CustomerManagement';

import { PAGE_SIZE } from '../../utilities/Pagination';
export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Controller Parametrics
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('first_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Offcanvas Drawer Controls
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    const offset = (currentPage - 1) * PAGE_SIZE;
    try {
      const res = await customerApi.listCustomers(PAGE_SIZE, offset);
      if (res.requestStatus) {
        setCustomers(res.data?.items || []);
        // Note: Set total count from response metadata if available, else approximate
        setTotalItems(res.data?.total || 0);
      } else {
        toast.error(res.message || 'Failed to fetch customer records.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Network communication error.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenOrdersDrawer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDrawerOpen(true);
  };

  const handleCloseOrdersDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedCustomer(null);
  };

  // Client-side Filter / Search logic
  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.first_name?.toLowerCase().includes(term) ||
        c.last_name?.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.telephone?.includes(term)
    );
  }, [customers, searchTerm]);

  const totalPages = useMemo(() => Math.ceil(totalItems / PAGE_SIZE) || 1, [totalItems]);
  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) range.push(i);
    return range;
  }, [totalPages]);

  const tableController = {
    currentPage,
    searchTerm,
    sortKey,
    sortDirection,
    totalPages,
    paginationRange,
    handleSearchChange: (query: string) => {
      setSearchTerm(query);
      setCurrentPage(1);
    },
    handleSortChange: (key: string) => {
      const isAsc = sortKey === key && sortDirection === 'asc';
      setSortDirection(isAsc ? 'desc' : 'asc');
      setSortKey(key);
    },
    handlePageChange: (pageNumber: number) => {
      setCurrentPage(pageNumber);
    },
  };

  const columns = useMemo(
    () =>
      getCustomerTableColumns({
        onViewOrders: handleOpenOrdersDrawer,
      }),
    []
  );

  return {
    customers: filteredCustomers,
    totalItems,
    isLoading,
    tableController,
    columns,
    selectedCustomer,
    isDrawerOpen,
    handleCloseOrdersDrawer,
    fetchCustomers,
  };
};