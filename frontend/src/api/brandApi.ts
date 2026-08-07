import { api } from './axiosInstance';
import type { APIResponse, PaginatedResult } from '../utilities/APIResponse';

export interface Brand {
  brand_id: string;
  brand_name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface BrandPayload {
  brand_name: string;
  description: string;
  is_active: boolean;
}


export const brandApi = {
  listBrand: async (search?: string, limit?:number,offset?:number): Promise<APIResponse<PaginatedResult<Brand>>> => {
    const response = await api.get('/brand', { params: { search, limit, offset } });
    return response.data;
  },

  getBrandById: async (brandId: string): Promise<APIResponse<Brand>> => {
    const response = await api.get(`/brand/${brandId}`);
    return response.data;
  },

  createBrand: async (payload: BrandPayload): Promise<APIResponse<Brand>> => {
    const response = await api.post('/brand', payload);
    return response.data;
  },

  updateBrand: async (brandId: string, payload: BrandPayload): Promise<APIResponse<Brand>> => {
    const response = await api.put(`/brand/${brandId}`, payload);
    return response.data;
  },

  deleteBrand: async (brandId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/brand/${brandId}`);
    return response.data;
  },
 
};