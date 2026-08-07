export interface APIResponse<T> {
  requestStatus: boolean;
  code: number;
  message: string;
  data: T;
}
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
