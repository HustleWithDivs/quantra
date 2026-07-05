import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { businessCategoryApi, type BusinessCategory,  type BusinessCategoryPayload } from '../../api/businessCategoryApi';

export interface UseBusinessCategoryFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingBusinessCategory: BusinessCategory | null;
}


const business_categoryValidationSchema = yup.object().shape({
  business_category_name: yup.string().required('BusinessCategory name tracking reference identifier is required'),
  business_category_description: yup.string().required('Description parameters required'),
  is_active: yup.boolean().default(true),
});

export const useBusinessCategoryForm = ({ show, onClose, onSave, editingBusinessCategory }: UseBusinessCategoryFormProps) => {
  const isEditMode = !!editingBusinessCategory;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
 
  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(business_categoryValidationSchema),
    defaultValues: {
      business_category_name: '',
      business_category_description: '',
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


        // 2. Fresh fetch-by-ID fallback loop if modifying a business_category profile
        if (isEditMode && editingBusinessCategory) {
          const business_categoryDetailsRes = await businessCategoryApi.getBusinessCategoryById(editingBusinessCategory.business_category_id);
          
          if (business_categoryDetailsRes.requestStatus && business_categoryDetailsRes.data) {
            const freshBusinessCategoryData = business_categoryDetailsRes.data;
            
            reset({
              business_category_name: freshBusinessCategoryData.business_category_name,
              business_category_description: freshBusinessCategoryData.business_category_description,
              is_active: freshBusinessCategoryData.is_active
            });

           
          } else {
            toast.error(business_categoryDetailsRes.message || 'Could not fetch current details for this business_category.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing business_category detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ business_category_name: '', business_category_description: '', is_active: true });
     
    }
  }, [show, editingBusinessCategory, isEditMode, reset]);

  // Group permission objects by their domain category modules
 



  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: BusinessCategoryPayload = {
      business_category_name: data.business_category_name,
      business_category_description: data.business_category_description,
      is_active: data.is_active,
      
    };

    try {
      let res;
      if (isEditMode && editingBusinessCategory) {
        res = await businessCategoryApi.updateBusinessCategory(editingBusinessCategory.business_category_id, payload);
      } else {
        res = await businessCategoryApi.createBusinessCategory(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `"${data.business_category_name}"  has been modified successfully.` : `BusinessCategory "${data.business_category_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync business_category structural variations.');
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