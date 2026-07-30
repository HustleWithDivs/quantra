import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { userApi, type User, type UserPayload } from '../../api/userApi';
import { roleApi, type Role } from '../../api/roleApi';
import type { QunatraSelectOption } from '../../components/reusable/QuantraSelectField';

interface UseUserFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingUser: User | null;
}

// Validation schema updated for single-role mandate
const userValidationSchema = yup.object().shape({
  first_name: yup.string().trim().required('First name identifier is required'),
  last_name: yup.string().trim().required('Last name identifier is required'),
  email: yup.string().trim().email('Invalid email address configuration structure').required('User contact login email is required'),
  gender: yup.string().max(1).required('Gender selection parameter is required'),
  is_active: yup.boolean().default(true),
  role_id: yup.string().required('An account security role assignment is mandatory'), // Single string validation rule
});

export const useUserForm = ({ show, onClose, onSave, editingUser }: UseUserFormProps) => {
  const isEditMode = !!editingUser;
  
  const [availableRoles, setAvailableRoles] = useState<QunatraSelectOption[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { register, watch,handleSubmit, formState: { errors }, reset, control } = useForm({
    resolver: yupResolver(userValidationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      gender: 'M',
      is_active: true,
      role_id: '' // Tracks single selected role ID string 
    }

  });
    const is_active =watch("is_active")

  useEffect(() => {
    const initializeUserModalData = async () => {
      setIsPageLoading(true);
      try {
        // 1. Fetch available role list options from server
        const rolesRes = await roleApi.listRoles();
        let availableRoles:QunatraSelectOption[]=[]
        if (rolesRes.requestStatus) {
           rolesRes.data.forEach((role) => {
              let description = `${role.role_name}${role.description ? ` — (${role.description})` : ''}`;
          // Push the values into your array
              availableRoles.push({ 
              value: role.role_id, 
              label: description
               });
          });
          setAvailableRoles(availableRoles || []);
        } else {
          toast.error(rolesRes.message || 'Failed to populate available server roles references.');
          return;
        }

        // 2. Hydrate form if editing an existing user record
        if (isEditMode && editingUser) {
          const userDetailsRes = await userApi.getUserById(editingUser.user_id);
          if (userDetailsRes.requestStatus && userDetailsRes.data) {
            const freshUserData = userDetailsRes.data;
            
            // Extract single role ID string from backend arrays safely
            const singleRoleId = freshUserData.roles_id && freshUserData.roles_id.length > 0 
              ? freshUserData.roles_id[0] 
              : '';

            reset({
              first_name: freshUserData.first_name,
              last_name: freshUserData.last_name,
              email: freshUserData.email,
              gender: freshUserData.gender,
              is_active: freshUserData.is_active,
              role_id: singleRoleId
            });
          } else {
            toast.error(userDetailsRes.message || 'Could not verify current user database records.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing sync validation profiles.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeUserModalData();
    } else {
      reset({ first_name: '', last_name: '', email: '', gender: 'M', is_active: true, role_id: '' });
    }
  }, [show, editingUser, isEditMode, reset]);

  const onSubmitForm = async (data: any) => {
    setIsSaving(true);

    const payload: UserPayload = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      gender: data.gender,
      is_active: data.is_active,
      role_id: data.role_id, // Sent directly as single string identifier key field
    };

    try {
      let res;
      if (isEditMode && editingUser) {
        res = await userApi.updateUser(editingUser.user_id, payload);
      } else {
        // Standard password auto-generation sequence logic 
        const cleanFirstName = data.first_name.trim().toLowerCase();
        const currentYear = new Date().getFullYear(); // 2026
        (payload as any).password = `${cleanFirstName}@quantra${currentYear}`;
        
        res = await userApi.createUser(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `Profile for "${data.first_name}" has been modified successfully.` : `User account "${data.first_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'Operation payload rejected by application controllers.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync user payload variables.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    availableRoles,
    isPageLoading,
    isSaving,
    isEditMode,
    onSubmitForm,
    is_active,
    control,
  };
};