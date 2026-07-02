import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface ProductVariant {
  product_variant_id: string;
  product_id: string;
  color_id: string | null;
  size_id: string | null;
  product_images: string[];
}

export interface Product {
  product_id: string;
  sku: string;
  upc_ean: string | null;
  product_name: string;
  short_description: string | null;
  long_description: string | null;
  business_category_id: string;
  department_id: string;
  category_id: string;
  sub_category_id: string;
  product_type_id: string;
  brand_id: string | null;
  supplier_id: string | null;
  material_id: string | null;
  cost_price: number;
  selling_price: number;
  stock_qty: number;
  barcode: string | null;
  min_order_qty: number;
  weight: number | null;
  dimensions: string | null;
  uom: string | null;
  is_active: boolean;
  is_taxable: boolean;
  is_perishable: boolean;
  expiry_date: string | null;
  created_at: string;
  variants: ProductVariant[];
}

export interface ProductPayload {
  sku: string;
  product_name: string;
  business_category_id: string;
  department_id: string;
  category_id: string;
  sub_category_id: string;
  product_type_id: string;
  cost_price: number;
  selling_price: number;
  stock_qty: number;
  color_id?: string;
  size_id?: string;
  upc_ean?: string;
  short_description?: string;
  long_description?: string;
  barcode?: string;
  min_order_qty?: number;
  weight?: number;
  dimensions?: string;
  uom?: string;
  is_active?: boolean;
  is_taxable?: boolean;
  is_perishable?: boolean;
  image_files?: File[];
}

export const productApi = {
  listProducts: async (search?: string): Promise<APIResponse<Product[]>> => {
    const response = await api.get('/products', { params: { search } });
    return response.data;
  },

  getProductById: async (productId: string): Promise<APIResponse<Product>> => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  createProduct: async (payload: ProductPayload): Promise<APIResponse<Product>> => {
    const formData = new FormData();
    
    // Append text properties
    Object.entries(payload).forEach(([key, value]) => {
      if (key !== 'image_files' && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Append images array sequentially matching backend multi-part parameters
    if (payload.image_files && payload.image_files.length > 0) {
      payload.image_files.forEach((file) => {
        formData.append('image_files', file);
      });
    }

    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateProduct: async (productId: string, payload: Partial<ProductPayload>): Promise<APIResponse<Product>> => {
    const response = await api.put(`/products/${productId}`, payload);
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  deleteVariant: async (variantId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/products/variants/${variantId}`);
    return response.data;
  }
};