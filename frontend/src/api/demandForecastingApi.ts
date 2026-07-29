import { api } from './axiosInstance';

export interface OptionItem {
  id: string;
  name: string;
}

export interface ForecastData {
  metrics: {
    predicted_peak_month?: string;
    predicted_peak_growth?: string;
    avg_monthly_growth?: string;
    confidence_interval?: string;
    seasonality_factor?: string;
  };
  chart_points: Array<{
    date_label: string;
    actual_quantity?: number;
    forecast_quantity?: number;
    is_forecast?: boolean;
  }>;
}

/**
 * Normalizes dynamic backend catalog responses into unified { id, name } objects
 */
const normalizeCatalogItem = (item: any, level: string): OptionItem => {
  switch (level) {
    case 'brand':
      return {
        id: item.brand_id,
        name: item.brand_name,
      };
    case 'category':
      return {
        id: item.category_id ,
        name: item.category_name ,
      };
    case 'subcategory':
      return {
        id: item.sub_category_id ,
        name: item.sub_category_name,
      };
    case 'product':
      return {
        id: item.product_id ,
        name: item.product_name,
      };
    default:
      return {
        id: item.id,
        name: item.name || item.title || 'Option',
      };
  }
};

export const demandForecastingApi = {
  // Fetch & normalize dropdown options per level
  getLevelOptions: async (level: string): Promise<OptionItem[]> => {
    // Standardize URL paths if needed (e.g. brand -> /catalog/brands)
    const endpointMap: Record<string, string> = {
      brand: '/brand',
      category: '/category',
      subcategory: '/sub-category',
      product: '/products',
    };

    const endpoint = endpointMap[level] || `/${level}`;
    const res = await api.get(endpoint);

    const rawData = res.data?.data || res.data || [];
    return rawData.map((item: any) => normalizeCatalogItem(item, level));
  },

  // Get latest forecast
  getLatestForecast: async (level: string, selectionUuid?: string): Promise<ForecastData> => {
    let url = `/demand-forecasting/forecasts/latest?level=${level}`;
    if (selectionUuid) url += `&selection_uuid=${selectionUuid}`;
    
    const res = await api.get(url);
    return res.data?.data || res.data;
  },

  // Generate new forecast run
  generateForecast: async (level: string, selectionUuid?: string, daysToPredict = 90): Promise<ForecastData> => {
    const payload: any = { level, days_to_predict: daysToPredict };
    if (selectionUuid) payload.selection_uuid = selectionUuid;

    const res = await api.post('/demand-forecasting/forecasts/generate', payload);
    return res.data?.data || res.data;
  },
};