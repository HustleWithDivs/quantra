import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { categoryApi, type Category } from '../../api/categoryApi';
import { useAuth } from '../../context/AuthContext';
import { getCategoryTableColumns } from '../../utilities/Master';

export const useCategory = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive States
  const [category, setCategory] = useState<Category[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Matrices State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('category_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal Overlay Visibilities
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Read Directory Handler
  const fetchCategory = async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      const res = await categoryApi.listCategory(searchTerm || undefined);
      if (res.requestStatus) {
        setCategory(res.data || []);
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
    fetchCategory();
  }, [accessToken, isAuthLoading, searchTerm]);

  // Destructive Removal Operation Handler
  const handleExecuteDelete = async () => {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await categoryApi.deleteCategory(categoryToDelete.category_id);
      if (res.requestStatus) {
        toast.success(`Category profile "${categoryToDelete.category_name || (categoryToDelete as any).category_name}" has been deleted successfully.`);
        setConfirmDeleteOpen(false);
        setCategoryToDelete(null);
        fetchCategory();
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
    getCategoryTableColumns({
      onEdit: (row) => {
        setSelectedCategory(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setCategoryToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    [] // Keep static since handler dependencies map back inside internal engine scopes cleanly
  );

  return {
    category,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Passed clean to the UI layer
    formModalOpen,
    setFormModalOpen,
    selectedCategory,
    setSelectedCategory,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    categoryToDelete,
    fetchCategory,
    handleExecuteDelete,
  };
};