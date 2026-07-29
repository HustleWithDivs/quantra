import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { departmentApi, type Department,  type DepartmentPayload } from '../../api/departmentApi';
import { businessCategoryApi, type BusinessCategory } from '../../api/businessCategoryApi';
import { type QunatraSelectOption } from '../../components/reusable/QuantraSelectField';
export interface UseDepartmentFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingDepartment: Department | null;
}

const departmentValidationSchema = yup.object().shape({
  department_name: yup.string().required('Department name tracking reference identifier is required'),
  department_description: yup.string().required('Department Description parameters required'),
  business_category_id: yup.string().required('Business Category is required'),
  is_active: yup.boolean().default(true),
});

export const useDepartmentForm = ({ show, onClose, onSave, editingDepartment }: UseDepartmentFormProps) => {
  const isEditMode = !!editingDepartment;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([]);

 
  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm({
    resolver: yupResolver(departmentValidationSchema),
    defaultValues: {
      department_name: '',
      department_description: '',
      business_category_id: '',
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
        const businessCategoriesRes = await businessCategoryApi.listBusinessCategory();
        let availableBusinessCategory:QunatraSelectOption[]=[]
        if (businessCategoriesRes.requestStatus) {
           businessCategoriesRes.data.forEach((businessCategory) => {
          // Push the values into your array
              availableBusinessCategory.push({ 
              value: businessCategory.business_category_id,
              label: businessCategory.business_category_name
               });
          });
          setBusinessCategories(availableBusinessCategory || []);
        } else {
          toast.error(businessCategories.message || 'Failed to populate available server roles references.');
          return;
        }

        // 2. Fresh fetch-by-ID fallback loop if modifying a department profile
        if (isEditMode && editingDepartment) {
          const departmentDetailsRes = await departmentApi.getDepartmentById(editingDepartment.department_id);
          
          if (departmentDetailsRes.requestStatus && departmentDetailsRes.data) {
            const freshDepartmentData = departmentDetailsRes.data;
            
            reset({
              department_name: freshDepartmentData.department_name,
              department_description: freshDepartmentData.department_description,
              business_category_id: freshDepartmentData.business_category_id,
              is_active: freshDepartmentData.is_active
            });

           
          } else {
            toast.error(departmentDetailsRes.message || 'Could not fetch current details for this department.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing department detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ department_name: '', department_description: '', business_category_id: '', is_active: true });
     
    }
  }, [show, editingDepartment, isEditMode, reset]);

  // Group permission objects by their domain category modules
 



  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: DepartmentPayload = {
      department_name: data.department_name,
      department_description: data.department_description,
       business_category_id: data.business_category_id,
      is_active: data.is_active,
      
    };

    try {
      let res;
      if (isEditMode && editingDepartment) {
        res = await departmentApi.updateDepartment(editingDepartment.department_id, payload);
      } else {
        res = await departmentApi.createDepartment(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `"${data.department_name}"  has been modified successfully.` : `Department "${data.department_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync department structural variations.');
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
    businessCategories,
    control
  };
};