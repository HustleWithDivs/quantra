import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { supplierApi, type Supplier,  type SupplierPayload } from '../../api/supplierApi';

export interface UseSupplierFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingSupplier: Supplier | null;
}


const supplierValidationSchema = yup.object().shape({
  supplier_code: yup.string().required('Supplier code tracking reference identifier is required'),
  supplier_name: yup.string().required('Supplier name parameters required'),
  is_active: yup.boolean().default(true),
});

export const useSupplierForm = ({ show, onClose, onSave, editingSupplier }: UseSupplierFormProps) => {
  const isEditMode = !!editingSupplier;
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
 
  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(supplierValidationSchema),
    defaultValues: {
      supplier_code: '',
      supplier_name: '',
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


        // 2. Fresh fetch-by-ID fallback loop if modifying a supplier profile
        if (isEditMode && editingSupplier) {
          const supplierDetailsRes = await supplierApi.getSupplierById(editingSupplier.supplier_id);
          
          if (supplierDetailsRes.requestStatus && supplierDetailsRes.data) {
            const freshSupplierData = supplierDetailsRes.data;
            
            reset({
              supplier_code: freshSupplierData.supplier_code,
              supplier_name: freshSupplierData.supplier_name,
              is_active: freshSupplierData.is_active
            });

           
          } else {
            toast.error(supplierDetailsRes.message || 'Could not fetch current details for this supplier.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing supplier detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ supplier_code: '', supplier_name: '', is_active: true });
     
    }
  }, [show, editingSupplier, isEditMode, reset]);

  // Group permission objects by their domain category modules
 



  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: SupplierPayload = {
      supplier_code: data.supplier_code,
      supplier_name: data.supplier_name,
      is_active: data.is_active,
      
    };

    try {
      let res;
      if (isEditMode && editingSupplier) {
        res = await supplierApi.updateSupplier(editingSupplier.supplier_id, payload);
      } else {
        res = await supplierApi.createSupplier(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `"${data.supplier_name}"  has been modified successfully.` : `Supplier "${data.supplier_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync supplier structural variations.');
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