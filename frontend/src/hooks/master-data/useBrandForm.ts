import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { brandApi, type Brand,  type BrandPayload } from '../../api/brandApi';

export interface UseBrandFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingBrand: Brand | null;
}


const brandValidationSchema = yup.object().shape({
  brand_name: yup.string().required('Brand name tracking reference identifier is required'),
  description: yup.string().required('Description parameters required'),
  is_active: yup.boolean().default(true),
});

export const useBrandForm = ({ show, onClose, onSave, editingBrand }: UseBrandFormProps) => {
  const isEditMode = !!editingBrand;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
 
  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(brandValidationSchema),
    defaultValues: {
      brand_name: '',
      description: '',
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


        // 2. Fresh fetch-by-ID fallback loop if modifying a brand profile
        if (isEditMode && editingBrand) {
          const brandDetailsRes = await brandApi.getBrandById(editingBrand.brand_id);
          
          if (brandDetailsRes.requestStatus && brandDetailsRes.data) {
            const freshBrandData = brandDetailsRes.data;
            
            reset({
              brand_name: freshBrandData.brand_name,
              description: freshBrandData.description,
              is_active: freshBrandData.is_active
            });

           
          } else {
            toast.error(brandDetailsRes.message || 'Could not fetch current details for this brand.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing brand detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ brand_name: '', description: '', is_active: true });
     
    }
  }, [show, editingBrand, isEditMode, reset]);

  // Group permission objects by their domain category modules
 



  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: BrandPayload = {
      brand_name: data.brand_name,
      description: data.description,
      is_active: data.is_active,
      
    };

    try {
      let res;
      if (isEditMode && editingBrand) {
        res = await brandApi.updateBrand(editingBrand.brand_id, payload);
      } else {
        res = await brandApi.createBrand(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `"${data.brand_name}"  has been modified successfully.` : `Brand "${data.brand_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync brand structural variations.');
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