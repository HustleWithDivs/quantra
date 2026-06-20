import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { roleApi, type Role, type Permission, type RolePayload } from '../../api/roleApi';

interface UseRoleFormProps {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  editingRole: Role | null;
}

const roleValidationSchema = yup.object().shape({
  role_name: yup.string().required('Role name tracking reference identifier is required'),
  description: yup.string().required('Description parameters required'),
  is_active: yup.boolean().default(true),
});

export const useRoleForm = ({ show, onClose, onSave, editingRole }: UseRoleFormProps) => {
  const isEditMode = !!editingRole;
  
  // Core Operational States
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Initialize form configuration schema
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(roleValidationSchema),
    defaultValues: {
      role_name: '',
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
        const permRes = await roleApi.listPermissions();
        if (permRes.requestStatus) {
          setPermissions(permRes.data || []);
        } else {
          toast.error(permRes.message || 'Failed to populate global permission mappings.');
          return;
        }

        // 2. Fresh fetch-by-ID fallback loop if modifying a role profile
        if (isEditMode && editingRole) {
          const roleDetailsRes = await roleApi.getRoleById(editingRole.role_id);
          
          if (roleDetailsRes.requestStatus && roleDetailsRes.data) {
            const freshRoleData = roleDetailsRes.data;
            
            reset({
              role_name: freshRoleData.role_name,
              description: freshRoleData.description,
              is_active: freshRoleData.is_active
            });

            if (freshRoleData.permissions_id) {
              setSelectedPermissions(freshRoleData.permissions_id);
            }
          } else {
            toast.error(roleDetailsRes.message || 'Could not fetch current details for this role.');
          }
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Error processing role detail data sync lookup loop.');
      } finally {
        setIsPageLoading(false);
      }
    };

    if (show) {
      initializeModalData();
    } else {
      // Clean up local tracking buffers on closure
      reset({ role_name: '', description: '', is_active: true });
      setSelectedPermissions([]);
    }
  }, [show, editingRole, isEditMode, reset]);

  // Group permission objects by their domain category modules
 

  const handleTogglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Submit Handler Mutation Wrapper
  const onSubmitForm = async (data: any) => {
    setIsSaving(true);
    const payload: RolePayload = {
      role_name: data.role_name,
      description: data.description,
      is_active: data.is_active,
      permission_ids: selectedPermissions,
    };

    try {
      let res;
      if (isEditMode && editingRole) {
        res = await roleApi.updateRole(editingRole.role_id, payload);
      } else {
        res = await roleApi.createRole(payload);
      }

      if (res.requestStatus) {
        toast.success(isEditMode ? `"${data.role_name}"  has been modified successfully.` : `Role "${data.role_name}" has been created successfully.`);
        onSave();
        onClose();
      } else {
        toast.error(res.message || 'An error occured please try again or contact system administrator.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to sync role structural variations.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    permissions,
    selectedPermissions,
    isPageLoading,
    isSaving,
    isEditMode,
    handleTogglePermission,
    onSubmitForm,
    is_active,

  };
};