export interface APIResponse<T> {
  requestStatus: boolean;
  code: number;
  message: string;
  data: T;
}