import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface predicted_peak_month {
  title:string;
  value: string;
  subtext: string;
}
export interface avg_monthly_growth {
  title:string;
  value: string;
  subtext: string;
}
export interface confidence_interval {
  title:string;
  value: string;
  subtext: string;
}
export interface seasonality_factor {
  title:string;
  value: string;
  subtext: string;
}

export interface ChartDataPoint {
  date_label: str;
  actual_quantity: number | null;
  predicted_quantity: number | null;
}

export interface SmartNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'link';
  message: string;
  timestamp_label: string;
}

export interface DashboardResponseData {
  last_updated: string;
  predicted_peak_month:predicted_peak_month;
  avg_monthly_growth:avg_monthly_growth;
  confidence_interval:confidence_interval;
  seasonality_factor:seasonality_factor;
  chart_data: ChartDataPoint[];
  notifications: SmartNotification[];
}

export const dashboardApi = {
  getInventoryHealth: async (): Promise<APIResponse<DashboardResponseData>> => {
    const response = await api.get('/dashboard/overview');
    return response.data;
  },
};