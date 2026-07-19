import { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';
import { api } from '../../api/axiosInstance';
import { forecastingApi, type ForecastDayPayload } from '../../api/forecastingApi';
import type { QunatraSelectOption } from '../../components/reusable/QuantraSelectField';

export const HorizonOptions: QunatraSelectOption[] = [
  { value: '7', label: '7 Days' },
  { value: '15', label: '15 Days' },
  { value: '30', label: '30 Days' },
  { value: '60', label: '60 Days' },
  { value: '90', label: '90 Days' }
];

export const LevelOptions: QunatraSelectOption[] = [
  { value: 'overall', label: 'Overall System Scope' },
  { value: 'brand', label: 'Brand Matrix' },
  { value: 'category', label: 'Category Node' },
  { value: 'subcategory', label: 'Sub-Category Segment' },
  { value: 'product', label: 'Individual Product SKU' }
];

export const useDemandForecasting = () => {
  const [dynamicOptions, setDynamicOptions] = useState<QunatraSelectOption[]>([]);
  const [chartData, setChartData] = useState<ForecastDayPayload[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      level: 'overall',
      selection_uuid: '',
      horizon: '15'
    }
  });

  const watchLevel = watch('level');

  // Reactive secondary listing lifecycle rules
  useEffect(() => {
    setValue('selection_uuid', '');
    setDynamicOptions([]);

    if (!watchLevel || watchLevel === 'overall') return;

    setIsLoading(true);
    let targetEndpoint = '';

    switch (watchLevel) {
      case 'brand': targetEndpoint = '/brand'; break;
      case 'category': targetEndpoint = '/category'; break;
      case 'subcategory': targetEndpoint = '/sub-category'; break;
      case 'product': targetEndpoint = '/products'; break;
      default: setIsLoading(false); return;
    }

    api.get(targetEndpoint)
      .then((res) => {
        const rawData = res.data.data || res.data || [];
        const options = rawData.map((item: any) => {
          if (watchLevel === 'brand') return { value: item.brand_id, label: item.brand_name };
          if (watchLevel === 'category') return { value: item.category_id, label: item.category_name };
          if (watchLevel === 'subcategory') return { value: item.sub_category_id, label: item.sub_category_name };
          if (watchLevel === 'product') return { value: item.product_id, label: `${item.product_name} (${item.sku})` };
          return null;
        }).filter(Boolean);
        setDynamicOptions(options);
      })
      .catch(() => toast.error(`Failed to gather lookup array for level: ${watchLevel}`))
      .finally(() => setIsLoading(false));
  }, [watchLevel, setValue]);

  const handleExecuteForecast = async (formData: any) => {
    if (formData.level !== 'overall' && !formData.selection_uuid) {
      toast.warning('Please target a listing value mapping for the active structural scale.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await forecastingApi.generateForecast({
        level: formData.level === 'brand' ? 'brand' : formData.level, // API Taxonomy map normalization
        selection_uuid: formData.level === 'overall' ? null : formData.selection_uuid,
        days_to_predict: parseInt(formData.horizon, 10)
      });

      if (res.requestStatus && res.data) {
        // Map timestamps into readable frontend chart expressions
        const formattedData = res.data.values.map((v) => ({
          forecast_date: new Date(v.forecast_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          predicted_quantity: parseFloat(v.predicted_quantity.toFixed(2))
        }));
        setChartData(formattedData);
        toast.success(res.message || 'Analytical baseline matrices rendered.');
      } else {
        toast.error(res.message || 'The server rejected parameter calculations.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Execution timeout.');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    register,
    handleSubmit,
    control,
    watchLevel,
    dynamicOptions,
    chartData,
    isLoading,
    isGenerating,
    handleExecuteForecast,
    errors
  };
};