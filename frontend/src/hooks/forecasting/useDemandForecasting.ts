import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  demandForecastingApi,
  type OptionItem,
  type ForecastData,
} from '../../api/demandForecastingApi';

export const useDemandForecasting = () => {
  const [level, setLevel] = useState<string>('overall');
  const [selectionUuid, setSelectionUuid] = useState<string>('');
  const [options, setOptions] = useState<OptionItem[]>([]);
  
  const [loadingOptions, setLoadingOptions] = useState<boolean>(false);
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);

  // Load level dropdown options
  useEffect(() => {
    if (level === 'overall') {
      setSelectionUuid('');
      setOptions([]);
      return;
    }

    const fetchLevelOptions = async () => {
      setLoadingOptions(true);
      try {
        const items = await demandForecastingApi.getLevelOptions(level);
        setOptions(items);

        if (items.length > 0) {
          setSelectionUuid(items[0].id);
        } else {
          setSelectionUuid('');
        }
      } catch (err) {
        toast.error(`Failed to load ${level} list.`);
        setOptions([]);
        setSelectionUuid('');
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchLevelOptions();
  }, [level]);

  // Fetch or trigger forecast generation
  const fetchForecast = useCallback(async () => {
    if (level !== 'overall' && !selectionUuid) return;

    setLoading(true);
    try {
      const forecastResult = await demandForecastingApi.getLatestForecast(level, selectionUuid);
      setData(forecastResult);
    } catch (err) {
      toast.info(`No forecast found for selected ${level}. Generating new forecast...`);
      await handleGenerateForecast();
    } finally {
      setLoading(false);
    }
  }, [level, selectionUuid]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const handleGenerateForecast = async () => {
    setGenerating(true);
    try {
      const forecastResult = await demandForecastingApi.generateForecast(level, selectionUuid);
      setData(forecastResult);
      toast.success('Forecast generated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to generate forecast.');
    } finally {
      setGenerating(false);
    }
  };

  return {
    level,
    setLevel,
    selectionUuid,
    setSelectionUuid,
    options,
    loadingOptions,
    data,
    loading,
    generating,
    handleGenerateForecast,
    fetchForecast,
  };
};