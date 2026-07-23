import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mappingApi, type UpdateMappingPayload } from '../../api/mappingApi';
import { type MappingTemplate } from '../../utilities/MappingManagement';

interface UseMappingFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingTemplate: MappingTemplate | null;
  setValue: (name: string, value: any) => void; // 👈 Add this line to accept form hydration controller
}

export const useMappingForm = ({ show, onClose, onSave, editingTemplate, setValue }: UseMappingFormProps) => {
  const isEditMode = !!editingTemplate;
  const [name, setName] = useState<string>('');
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const initializeFormState = async () => {
      if (!editingTemplate) return;
      
      setIsPageLoading(true);
      try {
        const res = await mappingApi.getTemplateById(editingTemplate.template_id);
        let freshMappings: Record<string, string> = {};

        if (res.requestStatus && res.data) {
          setName(res.data.template_name || '');
          freshMappings = res.data.column_mapping || {};
        } else {
          setName(editingTemplate.template_name);
          freshMappings = editingTemplate.column_mapping || {};
        }

        setMappings(freshMappings);

        Object.entries(freshMappings).forEach(([csvHeader, targetField]) => {
          setValue(`mapping_${csvHeader}`, targetField);
        });

      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing sync template configuration.');
        setName(editingTemplate.template_name);
        setMappings(editingTemplate.column_mapping || {});
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show && isEditMode) {
      initializeFormState();
    } else {
      setName('');
      setMappings({});
    }
  }, [show, editingTemplate, isEditMode, setValue]);

  const handleValueChange = (csvHeader: string, targetField: string) => {
    setMappings((prev) => ({ ...prev, [csvHeader]: targetField }));
    setValue(`mapping_${csvHeader}`, targetField); // ✅ Sync change back to react-hook-form
  };

  const onSubmitForm = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      toast.error('Template profile name string is required.');
      return;
    }
    if (!editingTemplate) return;

    setIsSaving(true);
    const payload: UpdateMappingPayload = {
      template_name: name,
      column_mapping: mappings,
    };

    try {
      const res = await mappingApi.updateTemplate(editingTemplate.template_id, payload);
      if (res.requestStatus) {
        toast.success(`Ingestion layout matrix changes for "${name}" updated successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'Operation payload rejected by application controllers.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync template layout payload variables.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    name,
    setName,
    mappings,
    handleValueChange,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
  };
};