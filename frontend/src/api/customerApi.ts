import { api } from './axiosInstance';
import type { APIResponse, PaginatedResult } from '../utilities/APIResponse';

export interface HistoryItem {
  order_id: string;
  product_id?: string;
  is_discounted: boolean;
  price: number;
  quantity: number;
  total: number;
  sales_price: number;
  is_active: boolean;
}

export interface CustomerOrder {
  order_id: string;
  invoice_number: string;
  customer_id: string;
  cart_value: number;
  total_amount: number;
  discount: number;
  coupon_applied?: string;
  status: string;
  currency: string;
  is_active: boolean;
  history_items: HistoryItem[];
}

export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  telephone?: string;
  address?: string;
  city?: string;
  country?: number;
  gender?: string;
  date_of_birth?: string;
  source: string;
  source_customer_id: string;
  is_active: boolean;
}

export const customerApi = {
  // GET /api/v1/sales-data/customers?limit=10&offset=0
  listCustomers: async (limit = 10, offset = 0): Promise<APIResponse<PaginatedResult<Customer>>> => {
    const response = await api.get('/sales-data/customers', {
      params: { limit, offset },
    });
    return response.data;
  },

  // GET /api/v1/sales-data/orders/customer/{customer_id}
  getCustomerOrders: async (customerId: string): Promise<APIResponse<CustomerOrder[]>> => {
    const response = await api.get(`/sales-data/orders/customer/${customerId}`);
    return response.data;
  },
};