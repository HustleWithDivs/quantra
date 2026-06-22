import { api } from './axiosInstance';
import { type APIResponse } from '../utilities/APIResponse';
// Types matching your FastAPI Pydantic schemas implicitly
export interface LoginPayload {
  email: string; // adjust field names if your LoginRequest uses email/username
  password: string;
}

export interface TokenPairResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  first_name:string;
  last_name:string;
}



export const authApi = {
  login: async (payload: LoginPayload): Promise<APIResponse<TokenPairResponse>> => {
    return api.post('/auth/login', payload);
  },
  
  logout: async (refreshToken: string): Promise<APIResponse<Record<string, never>>> => {
    return api.post('/auth/logout', {}, {
      headers: {
        'refresh-token': refreshToken, // Maps to Header(..., description="...") in auth.py
      },
    });
  },
};