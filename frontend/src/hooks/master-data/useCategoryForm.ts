// app/hooks/master-data/useCategoryForm.ts
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { categoryApi, type Category, type CategoryPayload } from '../../api/categoryApi';
import { departmentApi } from '../../api/departmentApi';
import { type QunatraSelectOption } from '../../components/reusable/QuantraSelectField';

export interface UseCategoryFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingCategory: Category | null;
}

const categoryValidationSchema = yup.object().shape({
  category_name: yup.string().required('Category name is required'),
  category_description: yup.string().required('Category description is required'),
  department_id: yup.string().required('Department is required'),
  is_active: yup.boolean().default(true),
});

export const useCategoryForm = ({ show, onClose, onSave, editingCategory }: UseCategoryFormProps) => {
  const isEditMode = !!editingCategory;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [departmentOptions, setDepartmentOptions] = useState<QunatraSelectOption[]>([]);

  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm({
    resolver: yupResolver(categoryValidationSchema),
    defaultValues: {
      category_name: '',
      category_description: '',
      department_id: '',
      is_active: true
    }
  });

  const is_active = watch('is_active');

  useEffect(() => {
    const initializeModalData = async () => {
      setIsPageLoading(true);
      try {
        // 1. Fetch available department options
        const departmentRes = await departmentApi.listDepartment();
        if (departmentRes.requestStatus && departmentRes.data) {
          const formattedOptions: QunatraSelectOption[] = departmentRes.data.map((dept) => ({
            value: dept.department_id,
            label: dept.department_name
          }));
          setDepartmentOptions(formattedOptions);
        } else {
          toast.error(departmentRes.message || 'Failed to populate available departments.');
          return;
        }

  

        // 2. Fetch fresh details when editing
        if (isEditMode && editingCategory) {
          const categoryDetailsRes = await categoryApi.getCategoryById(editingCategory.category_id);
          
          if (categoryDetailsRes.requestStatus && categoryDetailsRes.data) {
            const freshCategoryData = categoryDetailsRes.data;
            
            // Safely resolve department ID whether backend returns objects or plain UUID strings
            let currentDeptId = '';

            if (freshCategoryData.departments && freshCategoryData.departments.length > 0) {
              const firstDept: any = freshCategoryData.departments[0];
              // If it's an object with department_id, use it; otherwise it's already a string UUID
              currentDeptId = typeof firstDept === 'object' ? firstDept.department_id : firstDept;
            } else if (freshCategoryData.department_ids && freshCategoryData.department_ids.length > 0) {
              currentDeptId = freshCategoryData.department_ids[0];
            }

            reset({
              category_name: freshCategoryData.category_name,
              category_description: freshCategoryData.category_description,
              department_id: currentDeptId, // <--- Correctly binds the string UUID!
              is_active: freshCategoryData.is_active
            });
          } else {
            toast.error(categoryDetailsRes.message || 'Could not fetch current details for this category.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing category detail data sync.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      reset({ category_name: '', category_description: '', department_id: '', is_active: true });
    }
  }, [show, editingCategory, isEditMode, reset]);

  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);

    // Map department_id string into department_ids array required by backend service
    const payload: CategoryPayload = {
      category_name: data.category_name,
      category_description: data.category_description,
      department_ids: data.department_id ? [data.department_id] : [],
      is_active: data.is_active,
    };

    try {
      let res;
      if (isEditMode && editingCategory) {
        res = await categoryApi.updateCategory(editingCategory.category_id, payload);
      } else {
        res = await categoryApi.createCategory(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `"${data.category_name}" updated successfully.` : `Category "${data.category_name}" created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occurred while saving.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update category.');
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
    departmentOptions,
    control
  };
};