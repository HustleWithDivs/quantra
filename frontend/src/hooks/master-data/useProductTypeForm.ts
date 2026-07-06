import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { productTypeApi, type ProductType,  type ProductTypePayload } from '../../api/productTypeApi';
import { subCategoryApi, type SubCategory } from '../../api/subCategoryApi';
import { type QunatraSelectOption } from '../../components/reusable/QuantraSelectField';
export interface UseProductTypeFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingProductType: ProductType | null;
}

const productTypeValidationSchema = yup.object().shape({
  product_type: yup.string().required('ProductType name tracking reference identifier is required'),
  product_type_description: yup.string().required('ProductType Description parameters required'),
  sub_category_id: yup.string().required('Sub Category is required'),
  is_active: yup.boolean().default(true),
});

export const useProductTypeForm = ({ show, onClose, onSave, editingProductType }: UseProductTypeFormProps) => {
  const isEditMode = !!editingProductType;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

 
  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch, control } = useForm({
    resolver: yupResolver(productTypeValidationSchema),
    defaultValues: {
      product_type: '',
      product_type_description: '',
      sub_category_id: '',
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
        const subCategoriesRes = await subCategoryApi.listSubCategory();
        let availableSubCategory:QunatraSelectOption[]=[]
        if (subCategoriesRes.requestStatus) {
           subCategoriesRes.data.forEach((subCategory) => {
          // Push the values into your array
              availableSubCategory.push({ 
              value: subCategory.sub_category_id,
              label: subCategory.sub_category_name
               });
          });
          setSubCategories(availableSubCategory || []);
        } else {
          toast.error(subCategories.message || 'Failed to populate available server roles references.');
          return;
        }

        // 2. Fresh fetch-by-ID fallback loop if modifying a product_type profile
        if (isEditMode && editingProductType) {
          const productTypeDetailsRes = await productTypeApi.getProductTypeById(editingProductType.product_type_id);
          
          if (productTypeDetailsRes.requestStatus && productTypeDetailsRes.data) {
            const freshProductTypeData = productTypeDetailsRes.data;
            
            reset({
              product_type: freshProductTypeData.product_type,
              product_type_description: freshProductTypeData.product_type_description,
              sub_category_id: freshProductTypeData.sub_category_id,
              is_active: freshProductTypeData.is_active
            });

           
          } else {
            toast.error(productTypeDetailsRes.message || 'Could not fetch current details for this product type.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing product type detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ product_type: '', product_type_description: '', sub_category_id: '', is_active: true });
     
    }
  }, [show, editingProductType, isEditMode, reset]);

  // Group permission objects by their domain category modules
 



  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: ProductTypePayload = {
      product_type: data.product_type,
      product_type_description: data.product_type_description,
       sub_category_id: data.sub_category_id,
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
        toast.success(isEditMode ? `"${data.product_type}"  has been modified successfully.` : `ProductType "${data.product_type}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync product_type structural variations.');
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
    subCategories,
    control
  };
};