import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';
import { type MappingTemplate } from '../utilities/MappingManagement';

export interface UpdateMappingPayload {
  template_name: string;
  column_mapping: Record<string, string>;
  
}

export const mappingApi = {
  getTemplateById: async (templateId: string): Promise<APIResponse<MappingTemplate>> => {
    const response = await api.get(`/ingestion/templates/${templateId}`);
    return response.data;
  },

  updateTemplate: async (templateId: string, payload: UpdateMappingPayload): Promise<APIResponse<MappingTemplate>> => {
    const response = await api.put(`/ingestion/templates/${templateId}`, payload);
    return response.data;
  }
};