import type { APIResponse, PaginatedResult } from '../utilities/APIResponse';
import { api } from './axiosInstance';

export interface Permission {
  permission_id: string;
  slug: string;
  code: string;
  description?: string;
  is_active: boolean;
}

export interface Role {
  role_id: string;
  role_name: string;
  description: string;
  is_active: boolean;
  permissions_id?: string[];
}

export interface RolePayload {
  role_name: string;
  description: string;
  is_active: boolean;
  permission_ids: string[]; // Grouping string code configurations
}

export const roleApi = {
  // 1. List roles - extract .data from AxiosResponse
  listRoles: async (search?: string, limit?:number,offset?:number): Promise<APIResponse<PaginatedResult<Role>>> => {
    const response = await api.get('/roles', { params: { search, limit, offset } }
    );
    return response.data; // CRITICAL FIX: Returns the APIResponse instead of AxiosResponse
  },

  // 2. List system permissions
  listPermissions: async (): Promise<APIResponse<Permission[]>> => {
    const response = await api.get('/permissions');
    return response.data; 
  },
  // 3. Get Details o created roles
getRoleById: async (roleId: string): Promise<APIResponse<Role>> => {
  const response = await api.get(`/roles/${roleId}`);
  return response.data; // Passes the full APIResponse envelope directly to the component
},

  // 4. Create a new system role
  createRole: async (payload: RolePayload): Promise<APIResponse<Role>> => {
    const response = await api.post('/roles', payload);
    return response.data;
  },

  // 5. Update basic role parameters
  updateRole: async (roleId: string, payload: RolePayload): Promise<APIResponse<Role>> => {
    const response = await api.put(`/roles/${roleId}`, payload);
    return response.data;
  },

  // 6. Delete a system role profile
  deleteRole: async (roleId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/roles/${roleId}`);
    return response.data;
  }
};