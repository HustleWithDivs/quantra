import { useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../../api/axiosInstance';

import { DB_PRODUCT_TARGET_FIELDS } from '../../utilities/MappingManagement';
export const useBulkIngestionForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentMapping, setCurrentMapping] = useState<Record<string, string>>({});
  const [previewRows, setPreviewRows] = useState<Record<string, any>[]>([]);
  
  const [step, setStep] = useState<'UPLOAD' | 'MAPPING' | 'PREVIEW'>('UPLOAD');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConflictModal, setShowConflictModal] = useState<boolean>(false);
  const [templateName, setTemplateName] = useState<string>('');

  const handleFileAnalysis = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/ingestion/analyze-file', formData,  {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Force Axios to pass the original FormData instance safely
        transformRequest: [(data) => data], 
      });
      
      setHeaders(res.data.headers);
      setCurrentMapping(res.data.suggested_mapping || {});
      setPreviewRows(res.data.preview_rows || []);
      
      if (res.data.mapping_exists) {
        setShowConflictModal(true);
      } else {
        setStep('MAPPING');
        toast.info(`AI suggested standard mapping structures with match metadata score: ${res.data.match_percentage}%`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to analyze properties from matrix.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFieldMappingChange = (fileHeader: string, targetDbField: string) => {
    setCurrentMapping(prev => ({ ...prev, [fileHeader]: targetDbField }));
  };

  const saveMappingAndProceed = async () => {
    if (!templateName.trim()) {
      toast.warn('Please provide a descriptive mapping template name configuration title.');
      return;
    }
    try {
      await api.post('/ingestion/save-template', {
        template_name: templateName,
        column_mapping: currentMapping
      });
      toast.success('Mapping template schema compiled and stored securely.');
      setStep('PREVIEW');
    } catch (err: any) {
      toast.error('Failed to save mapping state parameters.');
    }
  };

  const executeBulkIngestion = async () => {
    if (!file) return;
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('column_mapping_json', JSON.stringify(currentMapping));

    try {
        const res = await api.post('/ingestion/execute-bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Force Axios to pass the original FormData instance safely
        transformRequest: [(data) => data], 
      });     
       if (res.data?.requestStatus) {
        toast.success(res.data.message);
        // Reset component layout parameters cleanly
        setFile(null);
        setHeaders([]);
        setCurrentMapping({});
        setPreviewRows([]);
        setStep('UPLOAD');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Execution error detected.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    file, headers, currentMapping, previewRows, step, isAnalyzing, isSubmitting,
    showConflictModal, templateName, targetDbFields: DB_PRODUCT_TARGET_FIELDS,
    setStep, setShowConflictModal, setTemplateName, handleFileAnalysis,
    handleFieldMappingChange, saveMappingAndProceed, executeBulkIngestion
  };
};