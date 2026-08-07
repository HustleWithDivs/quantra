import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { subCategoryApi, type SubCategory } from '../../api/subCategoryApi';
import { useAuth } from '../../context/AuthContext';
import { getSubCategoryTableColumns } from '../../utilities/Master';
import { PAGE_SIZE } from '../../utilities/Pagination';

export const useSubCategory = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive States
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Matrices State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('subCategory_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal Overlay Visibilities
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [subCategoryToDelete, setSubCategoryToDelete] = useState<SubCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Read Directory Handler
  const fetchSubCategory = async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      let offset=(currentPage - 1) * PAGE_SIZE
      const res = await subCategoryApi.listSubCategory(searchTerm || undefined, PAGE_SIZE, offset);
      if (res.requestStatus) {
        setSubCategory(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
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
    fetchSubCategory();
  }, [accessToken, isAuthLoading, searchTerm, currentPage]);

  // Destructive Removal Operation Handler
  const handleExecuteDelete = async () => {
    if (!subCategoryToDelete) return;
    setIsDeleting(true);
    try {
      const res = await subCategoryApi.deleteSubCategory(subCategoryToDelete.sub_category_id);
      if (res.requestStatus) {
        toast.success(`SubCategory profile "${subCategoryToDelete.sub_category_name || (subCategoryToDelete as any).sub_category_name}" has been deleted successfully.`);
        setConfirmDeleteOpen(false);
        setSubCategoryToDelete(null);
        fetchSubCategory();
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

  // ==========================================
  // HOOK EMBEDDED ACTION & COLUMNS COUPLING
  // ==========================================
  const columns = useMemo(() => 
    getSubCategoryTableColumns({
      onEdit: (row) => {
        setSelectedSubCategory(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setSubCategoryToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    [] // Keep static since handler dependencies map back inside internal engine scopes cleanly
  );

  return {
    subCategory,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Passed clean to the UI layer
    formModalOpen,
    setFormModalOpen,
    selectedSubCategory,
    setSelectedSubCategory,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    subCategoryToDelete,
    fetchSubCategory,
    handleExecuteDelete,
  };
};