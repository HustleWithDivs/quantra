import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { supplierApi, type Supplier } from '../../api/supplierApi';
import { useAuth } from '../../context/AuthContext';
import { getSupplierTableColumns } from '../../utilities/Master';

export const useSupplier = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive States
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Matrices State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('supplier_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal Overlay Visibilities
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Read Directory Handler
  const fetchSupplier = async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      const res = await supplierApi.listSupplier(searchTerm || undefined);
      if (res.requestStatus) {
        setSupplier(res.data || []);
        setTotalItems(res.data?.length || 0);
      } else {
        toast.error(res.message || 'An error occurred while fetching role definitions.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Network infrastructure communication timeout.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [accessToken, isAuthLoading, searchTerm]);

  // Destructive Removal Operation Handler
  const handleExecuteDelete = async () => {
    if (!supplierToDelete) return;
    setIsDeleting(true);
    try {
      const res = await supplierApi.deleteSupplier(supplierToDelete.supplier_id);
      if (res.requestStatus) {
        toast.success(`Supplier profile "${supplierToDelete.supplier_name || (supplierToDelete as any).supplier_name}" has been deleted successfully.`);
        setConfirmDeleteOpen(false);
        setSupplierToDelete(null);
        fetchSupplier();
      } else {
        toast.error(res.message || 'Deletion constraint rejected by server.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete operation dropped.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reusable QuantraTable Controller Properties
  const totalPages = useMemo(() => Math.ceil(totalItems / 10) || 1, [totalItems]);
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

  // ==========================================
  // HOOK EMBEDDED ACTION & COLUMNS COUPLING
  // ==========================================
  const columns = useMemo(() => 
    getSupplierTableColumns({
      onEdit: (row) => {
        setSelectedSupplier(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setSupplierToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    [] // Keep static since handler dependencies map back inside internal engine scopes cleanly
  );

  return {
    supplier,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Passed clean to the UI layer
    formModalOpen,
    setFormModalOpen,
    selectedSupplier,
    setSelectedSupplier,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    supplierToDelete,
    fetchSupplier,
    handleExecuteDelete,
  };
};