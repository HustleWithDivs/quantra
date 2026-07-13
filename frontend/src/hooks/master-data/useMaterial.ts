import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { materialApi, type Material } from '../../api/materialApi';
import { useAuth } from '../../context/AuthContext';
import { getMaterialTableColumns } from '../../utilities/Master';

export const useMaterial = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive States
  const [material, setMaterial] = useState<Material[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Matrices State Management
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('material_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Modal Overlay Visibilities
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Read Directory Handler
  const fetchMaterial = async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      const res = await materialApi.listMaterial(searchTerm || undefined);
      if (res.requestStatus) {
        setMaterial(res.data || []);
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
    fetchMaterial();
  }, [accessToken, isAuthLoading, searchTerm]);

  // Destructive Removal Operation Handler
  const handleExecuteDelete = async () => {
    if (!materialToDelete) return;
    setIsDeleting(true);
    try {
      const res = await materialApi.deleteMaterial(materialToDelete.material_id);
      if (res.requestStatus) {
        toast.success(`Material profile "${materialToDelete.material_name || (materialToDelete as any).material_name}" has been deleted successfully.`);
        setConfirmDeleteOpen(false);
        setMaterialToDelete(null);
        fetchMaterial();
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
    getMaterialTableColumns({
      onEdit: (row) => {
        setSelectedMaterial(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setMaterialToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    [] // Keep static since handler dependencies map back inside internal engine scopes cleanly
  );

  return {
    material,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns, // Passed clean to the UI layer
    formModalOpen,
    setFormModalOpen,
    selectedMaterial,
    setSelectedMaterial,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    materialToDelete,
    fetchMaterial,
    handleExecuteDelete,
  };
};