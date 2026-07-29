import { api } from './axiosInstance';
import type { APIResponse } from '../utilities/APIResponse';

export interface SimulationRequest {
  level?: 'overall' | 'brand' | 'category' | 'subcategory' | 'product';
  selection_uuid?: string;
  shipping_delay_days: number;
  competitor_price_change_pct: number;
  demand_multiplier: number;
  projection_days?: number;
}

export interface SimulationResponseData {
  level: string;
  selection_uuid?: string;
  projected_profit_risk: number;
  revenue_impact: number;
  stockout_risk_percentage: number;
  customer_satisfaction_index: number;
  scenario_summary: string;
}

export const simulatorApi = {
  runSimulation: async (payload: SimulationRequest): Promise<APIResponse<SimulationResponseData>> => {
    const response = await api.post('/what-if-simulator/run', payload);
    return response.data;
  },
};