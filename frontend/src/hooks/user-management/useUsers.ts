import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { userApi, type User } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import { getUserTableColumns } from '../../utilities/UserManagement';

export const useUsers = () => {
  const { accessToken, isLoading: isAuthLoading } = useAuth();

  // Core Reactive Data Frames
  const [users, setUsers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Table Controller Parametrics
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortKey, setSortKey] = useState<string>('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Overlay Component Controls
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchUsers = async () => {
    if (isAuthLoading || !accessToken) return;
    setIsLoading(true);
    try {
      const res = await userApi.listUsers(searchTerm || undefined);
      if (res.requestStatus) {
        setUsers(res.data || []);
        setTotalItems(res.data?.length || 0);
      } else {
        toast.error(res.message || 'An error occurred while fetching user accounts.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Network architecture communication timeout.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [accessToken, isAuthLoading, searchTerm]);

  const handleExecuteDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const res = await userApi.deleteUser(userToDelete.user_id);
      if (res.requestStatus) {
        toast.success(`User "${userToDelete.first_name}" has been permanently deleted successfully.`);
        setConfirmDeleteOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        toast.error(res.message || 'Server rejected administrative account deletion request.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete transaction dropped.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  const columns = useMemo(() => 
    getUserTableColumns({
      onEdit: (row) => {
        setSelectedUser(row);
        setFormModalOpen(true);
      },
      onDelete: (row) => {
        setUserToDelete(row);
        setConfirmDeleteOpen(true);
      },
    }),
    []
  );

  return {
    users,
    totalItems,
    isLoading,
    isDeleting,
    tableController,
    columns,
    formModalOpen,
    setFormModalOpen,
    selectedUser,
    setSelectedUser,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    userToDelete,
    fetchUsers,
    handleExecuteDelete,
  };
};