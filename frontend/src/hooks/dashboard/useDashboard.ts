import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { dashboardApi, type DashboardResponseData } from '../../api/dashboardApi';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await dashboardApi.getInventoryHealth();
      if (res.requestStatus && res.data) {
        setData(res.data);
      } else {
        toast.error(res.message || 'Failed to fetch inventory health metrics.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Dashboard server communication failure.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { data, isLoading, refetch: fetchDashboardData };
};