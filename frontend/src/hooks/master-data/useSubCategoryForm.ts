// useSubCategoryForm.ts

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { subCategoryApi, type SubCategory, type SubCategoryPayload } from '../../api/subCategoryApi';
import { categoryApi } from '../../api/categoryApi';
import { type QunatraSelectOption } from '../../components/reusable/QuantraSelectField';

export interface UseSubCategoryFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingSubCategory: SubCategory | null;
}

const subCategoryValidationSchema = yup.object().shape({
  sub_category_name: yup.string().required('SubCategory name tracking reference identifier is required'),
  sub_category_description: yup.string().required('SubCategory Description parameters required'),
  category_id: yup.string().required('Category is required'),
  is_active: yup.boolean().default(true),
});

export const useSubCategoryForm = ({ show, onClose, onSave, editingSubCategory }: UseSubCategoryFormProps) => {
  const isEditMode = !!editingSubCategory;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // FIX 1: Explicitly type options state as QunatraSelectOption[]
  const [categoryOptions, setCategoryOptions] = useState<QunatraSelectOption[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm({
    resolver: yupResolver(subCategoryValidationSchema),
    defaultValues: {
      sub_category_name: '',
      sub_category_description: '',
      category_id: '',
      is_active: true
    }
  });

  const is_active = watch('is_active');

  useEffect(() => {
    const initializeModalData = async () => {
      setIsPageLoading(true);
      try {
        // 1. Fetch Categories for Dropdown Options
        const categoryRes = await categoryApi.listCategory();
        if (categoryRes.requestStatus && categoryRes.data) {
          const availableCategory: QunatraSelectOption[] = categoryRes.data.map((cat) => ({
            value: cat.category_id,
            label: cat.category_name
          }));
          setCategoryOptions(availableCategory);
        } else {
          toast.error(categoryRes.message || 'Failed to populate available server roles references.');
          return;
        }

        // 2. Fetch Fresh SubCategory Details for Edit Mode
        if (isEditMode && editingSubCategory) {
          const subCategoryDetailsRes = await subCategoryApi.getSubCategoryById(editingSubCategory.sub_category_id);
          
          if (subCategoryDetailsRes.requestStatus && subCategoryDetailsRes.data) {
            const freshSubCategoryData = subCategoryDetailsRes.data;
            
            // FIX 2: Safely extract category_id from the backend array response (categories)
            const assignedCategoryId = freshSubCategoryData.categories && freshSubCategoryData.categories.length > 0
              ? freshSubCategoryData.categories[0]
              : '';

            reset({
              sub_category_name: freshSubCategoryData.sub_category_name,
              sub_category_description: freshSubCategoryData.sub_category_description,
              category_id: assignedCategoryId, // Populates select dropdown in edit mode
              is_active: freshSubCategoryData.is_active
            });
          } else {
            toast.error(subCategoryDetailsRes.message || 'Could not fetch current details for this sub_category.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing sub_category detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      reset({ sub_category_name: '', sub_category_description: '', category_id: '', is_active: true });
    }
  }, [show, editingSubCategory, isEditMode, reset]);

  // FIX 3: Map selected single category_id into category_ids array payload for backend
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    
    const payload: SubCategoryPayload = {
      sub_category_name: data.sub_category_name,
      sub_category_description: data.sub_category_description,
      category_ids: data.category_id ? [data.category_id] : [], // Send array expected by backend
      is_active: data.is_active,
    };

    try {
      let res;
      if (isEditMode && editingSubCategory) {
        res = await subCategoryApi.updateSubCategory(editingSubCategory.sub_category_id, payload);
      } else {
        res = await subCategoryApi.createSubCategory(payload);
      }

      if (res.requestStatus) {
        toast.success(
          isEditMode
            ? `"${data.sub_category_name}" has been modified successfully.`
            : `SubCategory "${data.sub_category_name}" has been created successfully.`
        );
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occurred please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync sub_category structural variations.');
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
    category: categoryOptions, // Form modal receives mapped options
    control
  };
};