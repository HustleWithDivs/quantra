import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../api/axiosInstance';

// Standardized structure expected by your internal cascading schema fields
export interface TargetDbField {
  key: string;
  label: string;
}

export const DB_PRODUCT_TARGET_FIELDS: TargetDbField[] = [
  { key: 'sku', label: 'SKU Identifier Code *' },
  { key: 'product_name', label: 'Product Display Name *' },
  { key: 'cost_price', label: 'Cost Price *' },
  { key: 'selling_price', label: 'Selling Retail Price *' },
  { key: 'stock_qty', label: 'Initial Inventory Stock Qty *' },
  { key: 'business_category_name', label: 'Business Category Hierarchy Text *' },
  { key: 'department_name', label: 'Department Text *' },
  { key: 'category_name', label: 'Category Text *' },
  { key: 'sub_category_name', label: 'Sub-Category Text *' },
  { key: 'product_type', label: 'Product Type Segment *' },
  { key: 'uom', label: 'Unit of Measurement (UOM)' }
];

export const useBulkIngestionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentMapping, setCurrentMapping] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Dispatches incoming raw files into our FastAPI column-parsing engine
   * and populates initial structural layout definitions via LangChain.
   */
  const handleFileAnalysis = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/ingestion/analyze-file', formData);
      if (res.data?.requestStatus) {
        setHeaders(res.data.data.headers);
        // Map LangChain suggestions down into the local view configuration matrices
        setCurrentMapping(res.data.data.suggested_mapping || {});
        toast.info('LangChain Engine generated layout optimization suggestions.');
      } else {
        toast.error(res.data?.message || 'Failed to successfully read structural file layout headers.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to parse columns.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * Updates state dictionary records on explicit selection adjustments
   */
  const handleFieldMappingChange = (fileHeader: string, targetDbField: string) => {
    setCurrentMapping(prev => ({ 
      ...prev, 
      [fileHeader]: targetDbField 
    }));
  };

  /**
   * Triggers background task processors for full file dataset processing
   */
  const executeBulkIngestion = async () => {
    if (!file) {
      toast.warn('Please stage a valid CSV catalog template resource first.');
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('column_mapping_json', JSON.stringify(currentMapping));

    try {
      const res = await api.post('/ingestion/execute-bulk-upload', formData);
      if (res.data?.requestStatus) {
        toast.success(res.data.message || 'Background worker process successfully kicked off.');
        // Clean up staged view components on clean background thread handoffs
        setFile(null);
        setHeaders([]);
        setCurrentMapping({});
      } else {
        toast.error(res.data?.message || 'Processing payload variables rejected by backend core configuration.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Ingestion transaction dropped.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    file,
    headers,
    currentMapping,
    isAnalyzing,
    isSubmitting,
    targetDbFields: DB_PRODUCT_TARGET_FIELDS,
    handleFileAnalysis,
    handleFieldMappingChange,
    executeBulkIngestion
  };
};