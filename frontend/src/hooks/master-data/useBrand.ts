import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { brandApi, type Brand } from '../../api/brandApi';
import { useAuth } from '../../context/AuthContext';
import { getBrandTableColumns } from '../../utilities/Master';
import { PAGE_SIZE } from '../../utilities/Pagination';
export const useBrand = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive States
  const [brand, setBrand] = useState<Brand[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Matrices State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('brand_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal Overlay Visibilities
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  

  // Read Directory Handler
  const fetchBrand = async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      let offset=(currentPage - 1) * PAGE_SIZE
      const res = await brandApi.listBrand(searchTerm || undefined, PAGE_SIZE, offset);
      if (res.requestStatus) {
        setBrand(res.data?.items || []);
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
    fetchBrand();
  }, [accessToken, isAuthLoading, searchTerm,currentPage]);

  // Destructive Removal Operation Handler
  const handleExecuteDelete = async () => {
    if (!brandToDelete) return;
    setIsDeleting(true);
    try {
      const res = await brandApi.deleteBrand(brandToDelete.brand_id);
      if (res.requestStatus) {
        toast.success(`Brand profile "${brandToDelete.brand_name || (brandToDelete as any).brand_name}" has been deleted successfully.`);
        setConfirmDeleteOpen(false);
        setBrandToDelete(null);
        fetchBrand();
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
    getBrandTableColumns({
      onEdit: (row) => {
        setSelectedBrand(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setBrandToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    [] // Keep static since handler dependencies map back inside internal engine scopes cleanly
  );

  return {
    brand,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Passed clean to the UI layer
    formModalOpen,
    setFormModalOpen,
    selectedBrand,
    setSelectedBrand,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    brandToDelete,
    fetchBrand,
    handleExecuteDelete,
  };
};