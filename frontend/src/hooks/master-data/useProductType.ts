import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { productTypeApi, type ProductType } from '../../api/productTypeApi';
import { useAuth } from '../../context/AuthContext';
import { getProductTypeTableColumns } from '../../utilities/Master';

export const useProductType = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive States
  const [product_type, setProductType] = useState<ProductType[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Matrices State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('product_type');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal Overlay Visibilities
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [productTypeToDelete, setProductTypeToDelete] = useState<ProductType | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Read Directory Handler wrapped in useCallback to avoid unnecessary re-fetches
  const fetchProductType = useCallback(async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      const res = await productTypeApi.listProductType(searchTerm || undefined);
      if (res.requestStatus) {
        setProductType(res.data || []);
        setTotalItems(res.data?.length || 0);
      } else {
        toast.error(res.message || 'An error occurred while fetching role definitions.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Network infrastructure communication timeout.');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, isAuthLoading, searchTerm]);

  useEffect(() => {
    fetchProductType();
  }, [fetchProductType]);

  // Destructive Removal Operation Handler
  const handleExecuteDelete = async () => {
    if (!productTypeToDelete) return;
    setIsDeleting(true);
    try {
      const res = await productTypeApi.deleteProductType(productTypeToDelete.product_type_id);
      if (res.requestStatus) {
        toast.success(`ProductType profile "${productTypeToDelete.product_type}" has been deleted successfully.`);
        setConfirmDeleteOpen(false);
        setProductTypeToDelete(null);
        fetchProductType();
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

  // Static Column Mapping with memoized callbacks
  const columns = useMemo(() => 
    getProductTypeTableColumns({
      onEdit: (row) => {
        setSelectedProductType(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setProductTypeToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    []
  );

  return {
    product_type,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns,
    formModalOpen,
    setFormModalOpen,
    selectedProductType,
    setSelectedProductType,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    productTypeToDelete,
    fetchProductType,
    handleExecuteDelete,
  };
};