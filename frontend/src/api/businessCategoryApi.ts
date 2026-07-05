import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface BusinessCategory {
  business_category_id: string;
  business_category_name: string;
  business_category_description: string;
  is_active: boolean;
  created_at: string;
}

export interface BusinessCategoryPayload {
  business_category_name: string;
  business_category_description: string;
  is_active: boolean;
}


export const businessCategoryApi = {
  listBusinessCategory: async (search?: string): Promise<APIResponse<BusinessCategory[]>> => {
    const response = await api.get('/business-category', { params: { search } });
    return response.data;
  },

  getBusinessCategoryById: async (business_category_id: string): Promise<APIResponse<BusinessCategory>> => {
    const response = await api.get(`/business-category/${business_category_id}`);
    return response.data;
  },

  createBusinessCategory: async (payload: BusinessCategoryPayload): Promise<APIResponse<BusinessCategory>> => {
    const response = await api.post('/business-category', payload);
    return response.data;
  },

  updateBusinessCategory: async (business_category_id: string, payload: BusinessCategoryPayload): Promise<APIResponse<BusinessCategory>> => {
    const response = await api.put(`/business-category/${business_category_id}`, payload);
    return response.data;
  },

  deleteBusinessCategory: async (business_category_id: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/business-category/${business_category_id}`);
    return response.data;
  },
 
};