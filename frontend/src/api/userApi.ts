import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  is_active: boolean;
  created_at: string;
  roles: string[];
  roles_id?: string[];
}

export interface UserPayload {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  is_active: boolean;
  role_id: string; // Updated from roles_id: string[] to single string field
}

export interface UserProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  is_active: boolean;
  roles: string[];
  roles_id:string[];
}

export const userApi = {
  listUsers: async (search?: string): Promise<APIResponse<User[]>> => {
    const response = await api.get('/users', { params: { search } });
    return response.data;
  },

  getUserById: async (userId: string): Promise<APIResponse<User>> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  createUser: async (payload: UserPayload): Promise<APIResponse<User>> => {
    const response = await api.post('/users', payload);
    return response.data;
  },

  updateUser: async (userId: string, payload: UserPayload): Promise<APIResponse<User>> => {
    const response = await api.put(`/users/${userId}`, payload);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
  getCurrentProfile: async (): Promise<APIResponse<UserProfile>> => {
    return api.get('/users/profile');
  },

  updateCurrentProfile: async (payload: Partial<UserProfile>): Promise<APIResponse<UserProfile>> => {
    return api.put('/users/profile', payload);
  }
};