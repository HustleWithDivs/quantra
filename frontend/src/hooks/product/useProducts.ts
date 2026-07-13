import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { productApi, type Product, type ProductVariant } from '../../api/productApi';
import { getProductTableColumns } from '../../utilities/Product';

export const useProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [variantModalOpen, setVariantModalOpen] = useState<boolean>(false);
  const [activeParentProductId, setActiveParentProductId] = useState<string>('');
  const [selectedVariantContext, setSelectedVariantContext] = useState<ProductVariant | null>(null);
  // Expander Trackers
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Removal Modals Context States
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productApi.listProducts(searchTerm || undefined);
      if (res.requestStatus && res.data) {
        setProducts(res.data);
        setTotalItems(res.data.length);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to compile catalogs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [searchTerm, currentPage]);

  const toggleRowExpansion = (productId: string) => {
    setExpandedRows(prev => ({ ...prev, [productId]: !prev[productId] }));
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
      toast.error(err.response?.data?.detail || 'Transaction contextual failure.');
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
      toast.error(err.response?.data?.detail || "Failed to drop target variant options node.");
    }
  };

  const columns = useMemo(() => 
    getProductTableColumns({
      onEdit: (row) => navigate(`/product-data/manage?id=${row.product_id}`),
      onDelete: (row) => { setProductToDelete(row); setConfirmDeleteOpen(true); },
      toggleExpand: (row) => toggleRowExpansion(row.product_id),
      isExpanded: (row) => !!expandedRows[row.product_id]
    }), [expandedRows, navigate]
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
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    columns,
    formModalOpen: false,
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
    openEditVariantModal
  };
};