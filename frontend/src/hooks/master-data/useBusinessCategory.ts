import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { businessCategoryApi, type BusinessCategory } from '../../api/businessCategoryApi';
import { useAuth } from '../../context/AuthContext';
import { getBusinessCategoryTableColumns } from '../../utilities/Master';

export const useBusinessCategory = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive States
  const [business_category, setBusinessCategory] = useState<BusinessCategory[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Matrices State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('business_category_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal Overlay Visibilities
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedBusinessCategory, setSelectedBusinessCategory] = useState<BusinessCategory | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [business_categoryToDelete, setBusinessCategoryToDelete] = useState<BusinessCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Read Directory Handler
  const fetchBusinessCategory = async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      const res = await businessCategoryApi.listBusinessCategory(searchTerm || undefined);
      if (res.requestStatus) {
        setBusinessCategory(res.data || []);
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
    fetchBusinessCategory();
  }, [accessToken, isAuthLoading, searchTerm]);

  // Destructive Removal Operation Handler
  const handleExecuteDelete = async () => {
    if (!business_categoryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await businessCategoryApi.deleteBusinessCategory(business_categoryToDelete.business_category_id);
      if (res.requestStatus) {
        toast.success(`BusinessCategory profile "${business_categoryToDelete.business_category_name || (business_categoryToDelete as any).business_category_name}" has been deleted successfully.`);
        setConfirmDeleteOpen(false);
        setBusinessCategoryToDelete(null);
        fetchBusinessCategory();
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
    getBusinessCategoryTableColumns({
      onEdit: (row) => {
        setSelectedBusinessCategory(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setBusinessCategoryToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    [] // Keep static since handler dependencies map back inside internal engine scopes cleanly
  );

  return {
    business_category,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Passed clean to the UI layer
    formModalOpen,
    setFormModalOpen,
    selectedBusinessCategory,
    setSelectedBusinessCategory,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    business_categoryToDelete,
    fetchBusinessCategory,
    handleExecuteDelete,
  };
};