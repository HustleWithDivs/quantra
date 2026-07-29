import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';
import type { Department } from './departmentApi';

export interface Category {
  departments?: Department[]; // Department objects returned from backend
  department_ids?: string[];
  category_id: string;
  category_name: string;
  category_description: string;
  business_category_id: string;
  is_active: boolean;
  created_at: string;
}

export interface CategoryPayload {
  category_name: string;
  category_description: string;
  department_ids: string[]; // Correct payload attribute expected by backend
  is_active: boolean;
}


export const categoryApi = {
  listCategory: async (search?: string): Promise<APIResponse<Category[]>> => {
    const response = await api.get('/category', { params: { search } });
    return response.data;
  },

  getCategoryById: async (categoryId: string): Promise<APIResponse<Category>> => {
    const response = await api.get(`/category/${categoryId}`);
    return response.data;
  },

  createCategory: async (payload: CategoryPayload): Promise<APIResponse<Category>> => {
    const response = await api.post('/category', payload);
    return response.data;
  },

  updateCategory: async (categoryId: string, payload: CategoryPayload): Promise<APIResponse<Category>> => {
    const response = await api.put(`/category/${categoryId}`, payload);
    return response.data;
  },

  deleteCategory: async (categoryId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/category/${categoryId}`);
    return response.data;
  },
 
};