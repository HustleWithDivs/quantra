import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { productTypeApi, type ProductType, type ProductTypePayload } from '../../api/productTypeApi';
import { subCategoryApi } from '../../api/subCategoryApi';
import { type QuantraSelectOption } from '../../components/reusable/QuantraSelectField';

export interface UseProductTypeFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingProductType: ProductType | null;
}

// Updated validation schema: makes description optional so empty textareas don't block submit
const productTypeValidationSchema = yup.object().shape({
  product_type: yup.string().required('Product Type name is required'),
  product_type_description: yup.string().optional().default(''),
  subcategory_id: yup.string().required('SubCategory selection is required'),
  is_active: yup.boolean().default(true),
});

export const useProductTypeForm = ({ show, onClose, onSave, editingProductType }: UseProductTypeFormProps) => {
  const isEditMode = Boolean(editingProductType);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [subCategoryOptions, setSubCategoryOptions] = useState<QuantraSelectOption[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm({
    resolver: yupResolver(productTypeValidationSchema),
    defaultValues: {
      product_type: '',
      product_type_description: '',
      subcategory_id: '',
      is_active: true
    }
  });

  const is_active = watch('is_active');

  useEffect(() => {
    const initializeModalData = async () => {
      setIsPageLoading(true);
      try {
        // 1. Fetch options for dropdown
        const subCategoryRes = await subCategoryApi.listSubCategory();
        if (subCategoryRes.requestStatus && subCategoryRes.data) {
          const availableSubCategories: QuantraSelectOption[] = subCategoryRes.data.map((subCat) => ({
            value: subCat.sub_category_id,
            label: subCat.sub_category_name
          }));
          setSubCategoryOptions(availableSubCategories);
        }

        // 2. Hydrate Edit Form State when editing
        if (editingProductType) {
          const detailsRes = await productTypeApi.getProductTypeById(editingProductType.product_type_id);
          
          if (detailsRes.requestStatus && detailsRes.data) {
            const freshData = detailsRes.data as any;
            
            // Check for both backend key 'sub_categories' and frontend key 'subcategories'
            const rawSubCategories = freshData.sub_categories || freshData.subcategories || [];
            
            let assignedSubCategoryId = '';
            if (Array.isArray(rawSubCategories) && rawSubCategories.length > 0) {
              const firstItem = rawSubCategories[0];
              assignedSubCategoryId = typeof firstItem === 'object' && firstItem !== null 
                ? (firstItem.sub_category_id || firstItem.id || '')
                : String(firstItem);
            }

            reset({
              product_type: freshData.product_type || '',
              product_type_description: freshData.product_type_description || '',
              subcategory_id: assignedSubCategoryId,
              is_active: freshData.is_active ?? true
            });
          }
        } else {
          // Reset for Create Mode
          reset({
            product_type: '',
            product_type_description: '',
            subcategory_id: '',
            is_active: true
          });
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error initializing product type form data.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      reset({
        product_type: '',
        product_type_description: '',
        subcategory_id: '',
        is_active: true
      });
    }
  }, [show, editingProductType, reset]);

  // Inside useProductTypeForm.ts

const onSubmitForm = async (data: any) => {
  setIsSaving(true);
  
  // Use sub_category_ids so the backend service reads the array correctly
  const payload: ProductTypePayload = {
    product_type: data.product_type,
    product_type_description: data.product_type_description || '',
    sub_category_ids: data.subcategory_id ? [data.subcategory_id] : [], // <-- Fixed payload key
    is_active: data.is_active,
  };

  try {
    let res;
    if (isEditMode && editingProductType) {
      res = await productTypeApi.updateProductType(editingProductType.product_type_id, payload);
    } else {
      res = await productTypeApi.createProductType(payload);
    }

    if (res.requestStatus) {
      toast.success(
        isEditMode
          ? `"${data.product_type}" updated successfully.`
          : `Product Type "${data.product_type}" created successfully.`
      );
      onSave();
      onClose();
    } else {
      toast.error(res.message || 'An error occurred while saving.');
    }
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to submit product type data.');
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
    subCategories: subCategoryOptions,
    control
  };
};