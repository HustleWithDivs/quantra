import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { simulatorApi, type SimulationResponseData } from '../../api/simulatorApi';

const DEFAULT_PRODUCT_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

export const useSimulator = (productId: string = DEFAULT_PRODUCT_ID) => {
  // Input parameters state
  const [shippingDelayDays, setShippingDelayDays] = useState<number>(3);
  const [competitorPriceChangePct, setCompetitorPriceChangePct] = useState<number>(0);
  const [demandMultiplier, setDemandMultiplier] = useState<number>(1.0);

  // Response simulation data
  const [simulationData, setSimulationData] = useState<SimulationResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeSimulation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await simulatorApi.runSimulation({
        product_id: productId,
        shipping_delay_days: shippingDelayDays,
        competitor_price_change_pct: competitorPriceChangePct,
        demand_multiplier: demandMultiplier,
        projection_days: 90,
      });

      if (res.requestStatus && res.data) {
        setSimulationData(res.data);
      } else {
        toast.error(res.message || 'Failed to calculate simulation scenario.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error communicating with simulation backend.');
    } finally {
      setIsLoading(false);
    }
  }, [productId, shippingDelayDays, competitorPriceChangePct, demandMultiplier]);

  // Debounced auto-execution on parameter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSimulation();
    }, 300);

    return () => clearTimeout(timer);
  }, [executeSimulation]);

  const handleReset = () => {
    setShippingDelayDays(0);
    setCompetitorPriceChangePct(0);
    setDemandMultiplier(1.0);
  };

  return {
    shippingDelayDays,
    setShippingDelayDays,
    competitorPriceChangePct,
    setCompetitorPriceChangePct,
    demandMultiplier,
    setDemandMultiplier,
    simulationData,
    isLoading,
    handleReset,
  };
};