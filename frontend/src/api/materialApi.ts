import { api } from './axiosInstance';
import type { APIResponse, PaginatedResult } from '../utilities/APIResponse';

export interface Material {
  material_id: string;
  material_name: string;
  material_description: string;
  is_active: boolean;
  created_at: string;
}

export interface MaterialPayload {
  material_name: string;
  material_description: string;
  is_active: boolean;
}


export const materialApi = {
  listMaterial: async (search?: string, limit?:number,offset?:number): Promise<APIResponse<PaginatedResult<Material>>> => {
    const response = await api.get('/material', { params: { search, limit, offset } });
    return response.data;
  },

  getMaterialById: async (materialId: string): Promise<APIResponse<Material>> => {
    const response = await api.get(`/material/${materialId}`);
    return response.data;
  },

  createMaterial: async (payload: MaterialPayload): Promise<APIResponse<Material>> => {
    const response = await api.post('/material', payload);
    return response.data;
  },

  updateMaterial: async (materialId: string, payload: MaterialPayload): Promise<APIResponse<Material>> => {
    const response = await api.put(`/material/${materialId}`, payload);
    return response.data;
  },

  deleteMaterial: async (materialId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/material/${materialId}`);
    return response.data;
  },
 
};