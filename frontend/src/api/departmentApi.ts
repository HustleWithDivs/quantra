import { api } from './axiosInstance';
import type { APIResponse, PaginatedResult } from '../utilities/APIResponse';

export interface Department {
  department_id: string;
  department_name: string;
  department_description: string;
  business_category_id: string;
  business_category_name?: string; // ADDED: Display name for listing table
  is_active: boolean;
  created_at: string;
}

export interface DepartmentPayload {
  department_name: string;
  department_description: string;
  business_category_id: string;
  is_active: boolean;
}


export const departmentApi = {
  listDepartment: async (search?: string, limit?:number,offset?:number): Promise<APIResponse<PaginatedResult<Department>>> => {
    const response = await api.get('/departments', { params: { search, limit, offset } });
    return response.data;
  },

  getDepartmentById: async (departmentId: string): Promise<APIResponse<Department>> => {
    const response = await api.get(`/departments/${departmentId}`);
    return response.data;
  },

  createDepartment: async (payload: DepartmentPayload): Promise<APIResponse<Department>> => {
    const response = await api.post('/departments', payload);
    return response.data;
  },

  updateDepartment: async (departmentId: string, payload: DepartmentPayload): Promise<APIResponse<Department>> => {
    const response = await api.put(`/departments/${departmentId}`, payload);
    return response.data;
  },

  deleteDepartment: async (departmentId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/departments/${departmentId}`);
    return response.data;
  },
 
};