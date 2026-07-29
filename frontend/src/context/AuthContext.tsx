import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import { authApi, type LoginPayload } from '../api/authApi';
import { api } from '../api/axiosInstance';

interface UserContextData {
  email: string;
  first_name?: string;
  last_name?: string;
  roles?: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: UserContextData | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  syncProfileContextData: (profile: UserContextData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserContextData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronous session recovery verification checks on boot layer execution
  useEffect(() => {
    const restoreSessionState = () => {
      try {
        const storedAccessToken = localStorage.getItem('at_ctx');
        const storedEmail = localStorage.getItem('user_email');
        const storedFirstName = localStorage.getItem('user_fname');
        const storedLastName = localStorage.getItem('user_lname');
        
        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          
          // Inject authorization token into current global Axios context
          api.defaults.headers.common['Authorization'] = `Bearer ${storedAccessToken}`;
          
          if (storedEmail) {
            setUser({ 
              email: storedEmail,
              first_name: storedFirstName || undefined,
              last_name: storedLastName || undefined
            });
          }
        }
      } catch (error) {
        console.error("Session reconstruction handshake failed:", error);
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSessionState();
  }, []);

  const syncProfileContextData = useCallback((profileData: UserContextData) => {
    setUser((prev) => {
      const updated = prev ? { ...prev, ...profileData } : profileData;
      
      if (updated.first_name) localStorage.setItem('user_fname', updated.first_name);
      if (updated.last_name) localStorage.setItem('user_lname', updated.last_name);
      if (updated.email) localStorage.setItem('user_email', updated.email);
      
      return updated;
    });
  }, []);

  const login = async (payload: LoginPayload) => {
    const response = await authApi.login(payload);
    
    // 1. Safe extraction handling the raw Axios envelope + backend standard response envelope structures
    const rawAxiosData = (response as any).data;
    const innerPayload = rawAxiosData?.data || rawAxiosData;
    const isSuccess = rawAxiosData?.requestStatus === true || (response as any).status === 200;

    if (isSuccess && innerPayload?.access_token) {
      const { access_token, refresh_token, first_name, last_name} = innerPayload;
      
      // 2. Bind authorization context straight to our active Axios configuration instance
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setAccessToken(access_token);
      setUser({ email: payload.email, first_name:first_name, last_name:last_name });

      // Persist access tokens cleanly to survive native web browser refreshes
      localStorage.setItem('at_ctx', access_token);
      localStorage.setItem('rt_ctx', refresh_token || '');
      localStorage.setItem('user_email', payload.email);
      localStorage.setItem('user_fname', innerPayload.first_name);
      localStorage.setItem('user_lname', innerPayload.last_name);

    } else {
      throw new Error(rawAxiosData?.message || 'The authorization security gateway rejected the provided credentials.');
    }
  };

  const logout = async () => {
    const storedRefreshToken = localStorage.getItem('rt_ctx');
    
    try {
      if (storedRefreshToken) {
        await authApi.logout(storedRefreshToken);
      }
    } catch (error) {
      console.warn("Remote token revocation skipped, performing complete client environment cleanup:", error);
    } finally {
      // Remove runtime Axios authorization header properties
      delete api.defaults.headers.common['Authorization'];
      
      setAccessToken(null);
      setUser(null);
      
      localStorage.removeItem('at_ctx');
      localStorage.removeItem('rt_ctx');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_fname');
      localStorage.removeItem('user_lname');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        user,
        isLoading,
        login,
        logout,
        syncProfileContextData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth requires wrapping structure underneath an active AuthProvider node.');
  }
  return context;
};