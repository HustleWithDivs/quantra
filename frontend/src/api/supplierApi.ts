import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface Supplier {
  supplier_id: string;
  supplier_code: string;
  supplier_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country_id: bigint;
  gst_number: string;
  is_active: boolean;
  created_at: string;
            
}

export interface SupplierPayload {
  supplier_id: string;
  supplier_code: string;
  supplier_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country_id: bigint;
  gst_number: string;
  is_active: boolean;
  created_at: string;
}


export const supplierApi = {
  listSupplier: async (search?: string): Promise<APIResponse<Supplier[]>> => {
    const response = await api.get('/supplier', { params: { search } });
    return response.data;
  },

  getSupplierById: async (supplierId: string): Promise<APIResponse<Supplier>> => {
    const response = await api.get(`/supplier/${supplierId}`);
    return response.data;
  },

  createSupplier: async (payload: SupplierPayload): Promise<APIResponse<Supplier>> => {
    const response = await api.post('/supplier', payload);
    return response.data;
  },

  updateSupplier: async (supplierId: string, payload: SupplierPayload): Promise<APIResponse<Supplier>> => {
    const response = await api.put(`/supplier/${supplierId}`, payload);
    return response.data;
  },

  deleteSupplier: async (supplierId: string): Promise<APIResponse<Record<string, any>>> => {
    const response = await api.delete(`/supplier/${supplierId}`);
    return response.data;
  },
 
};