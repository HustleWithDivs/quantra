import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface ProductType {
  product_type_id: string;
  product_type: string;
  product_type_description: string;
  subcategories?: string[];        // Array of UUIDs from backend
  subcategory_names?: string[];
  is_active: boolean;
  created_at: string;
}

export interface ProductTypePayload {
  product_type: string;
  product_type_description: string;
  sub_category_ids: string[];
  is_active: boolean;
}


export const productTypeApi = {
  listProductType: async (search?: string): Promise<APIResponse<ProductType[]>> => {
    const response = await api.get('/product-type', { params: { search } });
    return response.data;
  },

  getProductTypeById: async (product_type_id: string): Promise<APIResponse<ProductType>> => {
    const response = await api.get(`/product-type/${product_type_id}`);
    return response.data;
  },

  createProductType: async (payload: ProductTypePayload): Promise<APIResponse<ProductType>> => {
    const response = await api.post('/product-type', payload);
    return response.data;
  },

  updateProductType: async (product_type_id: string, payload: ProductTypePayload): Promise<APIResponse<ProductType>> => {
    const response = await api.put(`/product-type/${product_type_id}`, payload);
    return response.data;
  },

  deleteProductType: async (product_type_id: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/product-type/${product_type_id}`);
    return response.data;
  },
 
};