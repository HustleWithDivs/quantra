import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../api/axiosInstance'; // Or wherever your axios instance resides
import { getMappingTableColumns, type MappingTemplate } from '../../utilities/MappingManagement';
import { PAGE_SIZE } from '../../utilities/Pagination';

export const useMappingTemplates = () => {
  // Core Data Arrays
  const [templates, setTemplates] = useState<MappingTemplate[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Table Controller Parameters
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('template_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Interactive Overlays Toggle States
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<MappingTemplate | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [templateToDelete, setTemplateToDelete] = useState<MappingTemplate | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      // Passes params to mirror standard searchable list engines
      const res = await api.get('/ingestion/templates', { params: { search: searchTerm || undefined } });
      // Support nested list responses safely
      const dataPayload = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setTemplates(dataPayload);
      setTotalItems(dataPayload.length || 0);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to sync mapping templates from vault.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [searchTerm]);

  const handleExecuteDelete = async () => {
    if (!templateToDelete) return;
    setIsDeleting(true);
    try {
      // Standard DELETE route for ingestion templates
      const res = await api.delete(`/ingestion/templates/${templateToDelete.template_id}`);
      if (res.data?.requestStatus || res.status === 200) {
        toast.success(`Template layout config "${templateToDelete.template_name}" deleted.`);
        setConfirmDeleteOpen(false);
        setTemplateToDelete(null);
        fetchTemplates();
      } else {
        toast.error(res.data?.message || 'Server rejected template drop execution.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Delete operation abandoned.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  const columns = useMemo(() => 
    getMappingTableColumns({
      onEdit: (row) => {
        setSelectedTemplate(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setTemplateToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    []
  );

  return {
    templates,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns,
    formModalOpen,
    setFormModalOpen,
    selectedTemplate,
    setSelectedTemplate,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    templateToDelete,
    fetchTemplates,
    handleExecuteDelete,
  };
};