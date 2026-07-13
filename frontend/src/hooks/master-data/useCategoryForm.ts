import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { categoryApi, type Category,  type CategoryPayload } from '../../api/categoryApi';
import { departmentApi, type Department } from '../../api/departmentApi';
import { type QunatraSelectOption } from '../../components/reusable/QuantraSelectField';
export interface UseCategoryFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingCategory: Category | null;
}

const categoryValidationSchema = yup.object().shape({
  category_name: yup.string().required('Category name tracking reference identifier is required'),
  category_description: yup.string().required('Category Description parameters required'),
  department_id: yup.string().required('Department is required'),
  is_active: yup.boolean().default(true),
});

export const useCategoryForm = ({ show, onClose, onSave, editingCategory }: UseCategoryFormProps) => {
  const isEditMode = !!editingCategory;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [department, setDepartment] = useState<Department[]>([]);

 
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
  const is_active= watch('is_active')

  // Master Initialization Loop
  useEffect(() => {
    const initializeModalData = async () => {
      setIsPageLoading(true);
      try {
        // 1. Fetch system privilege directory entries
        const departmentRes = await departmentApi.listDepartment();
        let availableDeparment:QunatraSelectOption[]=[]
        if (departmentRes.requestStatus) {
           departmentRes.data.forEach((department) => {
          // Push the values into your array
              availableDeparment.push({ 
              value: department.department_id,
              label: department.department_name
               });
          });
          setDepartment(availableDeparment || []);
        } else {
          toast.error(department.message || 'Failed to populate available server department references.');
          return;
        }

        // 2. Fresh fetch-by-ID fallback loop if modifying a category profile
        if (isEditMode && editingCategory) {
          const categoryDetailsRes = await categoryApi.getCategoryById(editingCategory.category_id);
          
          if (categoryDetailsRes.requestStatus && categoryDetailsRes.data) {
            const freshCategoryData = categoryDetailsRes.data;
            
            reset({
              category_name: freshCategoryData.category_name,
              category_description: freshCategoryData.category_description,
              department_id: freshCategoryData.department_id,
              is_active: freshCategoryData.is_active
            });

           
          } else {
            toast.error(categoryDetailsRes.message || 'Could not fetch current details for this category.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing category detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ category_name: '', category_description: '', department_id: '', is_active: true });
     
    }
  }, [show, editingCategory, isEditMode, reset]);

  // Group permission objects by their domain category modules
 



  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: CategoryPayload = {
      category_name: data.category_name,
      category_description: data.category_description,
       department_id: data.department_id,
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
        toast.success(isEditMode ? `"${data.category_name}"  has been modified successfully.` : `Category "${data.category_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync category structural variations.');
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
    department,
    control
  };
};