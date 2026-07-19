import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface ForecastDayPayload {
  forecast_date: string;
  predicted_quantity: number;
}

export interface ForecastRunResponse {
  id: number;
  created_at: string;
  level: 'overall' | 'brand' |  'category' | 'subcategory' | 'product';
  selection_uuid: string | null;
  model_version: string;
  days_forecasted: number;
  values: ForecastDayPayload[];
}

export interface ForecastGenerationRequest {
  level: string;
  selection_uuid: string | null;
  days_to_predict: number;
}

export const forecastingApi = {
  generateForecast: async (payload: ForecastGenerationRequest): Promise<APIResponse<ForecastRunResponse>> => {
    const response = await api.post('/demand-forecasting/forecasts/generate', payload);
    return response.data;
  },

  getLatestForecast: async (level: string, selectionUuid?: string): Promise<APIResponse<ForecastRunResponse>> => {
    const response = await api.get('/demand-forecasting/forecasts/latest', {
      params: { level, selection_uuid: selectionUuid || undefined }
    });
    return response.data;
  }
};