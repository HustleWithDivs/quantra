import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Destructuring logout token cleaner from context
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleExecuteLogout = async () => {
    setIsLoggingOut(true);
    
    // Retrieve stored refresh tokens safely from application cache configurations
    const storedRefreshToken = localStorage.getItem('refresh_token') || '';

    try {
      // 1. Alert the backend router to invalidate token allocations
      if (storedRefreshToken) {
        await authApi.logout(storedRefreshToken);
      }
    } catch (err: any) {
      console.warn('Backend session cleanup dropped:', err?.response?.data?.message);
    } finally {
      // 2. Clear state elements locally even if network frameworks drop the frame
      logout(); 
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      toast.info('Session disconnected safely.');
      
      // 3. Force redirection back to login gate pathing structures
      navigate('/login', { replace: true });
      setIsLoggingOut(false);
    }
  };

  return {
    handleExecuteLogout,
    isLoggingOut,
  };
};