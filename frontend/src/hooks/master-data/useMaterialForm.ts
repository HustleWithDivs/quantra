import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { materialApi, type Material,  type MaterialPayload } from '../../api/materialApi';

export interface UseMaterialFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingMaterial: Material | null;
}


const materialValidationSchema = yup.object().shape({
  material_name: yup.string().required('Material name tracking reference identifier is required'),
  material_description: yup.string().required('Material Description parameters required'),
  is_active: yup.boolean().default(true),
});

export const useMaterialForm = ({ show, onClose, onSave, editingMaterial }: UseMaterialFormProps) => {
  const isEditMode = !!editingMaterial;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
 
  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(materialValidationSchema),
    defaultValues: {
      material_name: '',
      material_description: '',
      is_active: true
    }
  });
  const is_active= watch('is_active')

  // Master Initialization Loop
  useEffect(() => {
    const initializeModalData = async () => {
      setIsPageLoading(true);
      try {
        // 1. Fetch system privilege directory entries


        // 2. Fresh fetch-by-ID fallback loop if modifying a material profile
        if (isEditMode && editingMaterial) {
          const materialDetailsRes = await materialApi.getMaterialById(editingMaterial.material_id);
          
          if (materialDetailsRes.requestStatus && materialDetailsRes.data) {
            const freshMaterialData = materialDetailsRes.data;
            
            reset({
              material_name: freshMaterialData.material_name,
              material_description: freshMaterialData.material_description,
              is_active: freshMaterialData.is_active
            });

           
          } else {
            toast.error(materialDetailsRes.message || 'Could not fetch current details for this material.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing material detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ material_name: '', material_description: '', is_active: true });
     
    }
  }, [show, editingMaterial, isEditMode, reset]);

  // Group permission objects by their domain category modules
 



  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: MaterialPayload = {
      material_name: data.material_name,
      material_description: data.material_description,
      is_active: data.is_active,
      
    };

    try {
      let res;
      if (isEditMode && editingMaterial) {
        res = await materialApi.updateMaterial(editingMaterial.material_id, payload);
      } else {
        res = await materialApi.createMaterial(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `"${data.material_name}"  has been modified successfully.` : `Material "${data.material_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync material structural variations.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
    is_active,

  };
};