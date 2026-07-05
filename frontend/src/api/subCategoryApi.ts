import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface SubCategory {
  sub_category_id: string;
  sub_category_name: string;
  sub_category_description: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
}

export interface SubCategoryPayload {
  sub_category_name: string;
  sub_category_description: string;
  category_id: string;
  is_active: boolean;
}


export const subCategoryApi = {
  listSubCategory: async (search?: string): Promise<APIResponse<SubCategory[]>> => {
    const response = await api.get('/sub-category', { params: { search } });
    return response.data;
  },

  getSubCategoryById: async (sub_category_id: string): Promise<APIResponse<SubCategory>> => {
    const response = await api.get(`/sub-category/${sub_category_id}`);
    return response.data;
  },

  createSubCategory: async (payload: SubCategoryPayload): Promise<APIResponse<SubCategory>> => {
    const response = await api.post('/sub-category', payload);
    return response.data;
  },

  updateSubCategory: async (sub_category_id: string, payload: SubCategoryPayload): Promise<APIResponse<SubCategory>> => {
    const response = await api.put(`/sub-category/${sub_category_id}`, payload);
    return response.data;
  },

  deleteSubCategory: async (sub_category_id: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/sub-category/${sub_category_id}`);
    return response.data;
  },
 
};