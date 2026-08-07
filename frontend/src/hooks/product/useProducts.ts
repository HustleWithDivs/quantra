// src/hooks/product/useProducts.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { productApi, type Product, type ProductVariant } from '../../api/productApi';
import { getProductTableColumns } from '../../utilities/Product';
import { PAGE_SIZE } from '../../utilities/Pagination';


export const useProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Controller states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortKey, setSortKey] = useState<string>('sku');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Variant Modal & Expansion Contexts
  const [variantModalOpen, setVariantModalOpen] = useState<boolean>(false);
  const [activeParentProductId, setActiveParentProductId] = useState<string>('');
  const [selectedVariantContext, setSelectedVariantContext] = useState<ProductVariant | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Removal Modals Context States
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch products with search parameter
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      let offset=(currentPage - 1) * PAGE_SIZE
      const res = await productApi.listProducts(searchTerm || undefined, PAGE_SIZE, offset);
      if (res.requestStatus && res.data) {
        setProducts(res.data?.items || []);
        setTotalItems(res.data?.total || 0);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch catalog products.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm,currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, currentPage, searchTerm]);

  const toggleRowExpansion = (productId: string) => {
    setExpandedRows((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleExecuteDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const res = await productApi.deleteProduct(productToDelete.product_id);
      if (res.requestStatus) {
        toast.success(`Catalog entry "${productToDelete.product_name}" removed completely.`);
        setConfirmDeleteOpen(false);
        fetchProducts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Transaction failure.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExecuteVariantDelete = async (variantId: string) => {
    if (!window.confirm("Are you sure you want to remove this variant option?")) return;
    try {
      const res = await productApi.deleteVariant(variantId);
      if (res.requestStatus) {
        toast.success("Variant instance dropped.");
        fetchProducts();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to drop target variant option node.");
    }
  };

  // Pagination calculations
  const totalPages = useMemo(() => Math.ceil(totalItems / PAGE_SIZE) || 1, [totalItems]);
  const paginationRange = useMemo(() => {
    const range: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) range.push(i);
    return range;
  }, [totalPages]);

  // Construct functional tableController
  const tableController = {
    currentPage,
    searchTerm,
    sortKey,
    sortDirection,
    totalPages,
    paginationRange,
    handleSearchChange: (query: string) => {
      setSearchTerm(query);
      setCurrentPage(1); // Reset page on new search
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
      getProductTableColumns({
        onEdit: (row) => navigate(`/product-data/manage?id=${row.product_id}`),
        onDelete: (row) => {
          setProductToDelete(row);
          setConfirmDeleteOpen(true);
        },
        toggleExpand: (row) => toggleRowExpansion(row.product_id),
        isExpanded: (row) => !!expandedRows[row.product_id],
      }),
    [expandedRows, navigate]
  );

  const openCreateVariantModal = (productId: string) => {
    setActiveParentProductId(productId);
    setSelectedVariantContext(null);
    setVariantModalOpen(true);
  };

  const openEditVariantModal = (productId: string, variant: ProductVariant) => {
    setActiveParentProductId(productId);
    setSelectedVariantContext(variant);
    setVariantModalOpen(true);
  };

  return {
    products,
    totalItems,
    isLoading,
    isDeleting,
    tableController, // <--- Pass the active table controller
    columns,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    productToDelete,
    fetchProducts,
    handleExecuteDelete,
    expandedRows,
    toggleRowExpansion,
    handleExecuteVariantDelete,
    navigateToAddWizard: () => navigate('/product-data/manage'),
    variantModalOpen,
    setVariantModalOpen,
    activeParentProductId,
    selectedVariantContext,
    openCreateVariantModal,
    openEditVariantModal,
  };
};