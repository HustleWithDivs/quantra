import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

const profileValidationSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email structure style').required('Email address token tracking context required'),
  gender: yup.string().max(1).required('Gender mapping context is required'),
  roles_id: yup.array().of(yup.string()).default([]),
});

export const useSettingsForm = () => {
  // Pull syncProfileContextData from our updated AuthContext
  const { syncProfileContextData } = useAuth(); 
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { register, handleSubmit, formState: { errors }, reset,  control} = useForm({
    resolver: yupResolver(profileValidationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      gender: 'M',
      roles_id: []
    }
  });

  useEffect(() => {
    const fetchCurrentSessionProfile = async () => {
      setIsPageLoading(true);
      try {
        const response: any = await userApi.getCurrentProfile();
        
        // FIX: Extract data from the nested .data property of the API envelope
        const profilePayload = response.data?.data || response.data;
        
        if (profilePayload) {
          reset({
            first_name: profilePayload.first_name || '',
            last_name: profilePayload.last_name || '',
            email: profilePayload.email || '',
            gender: profilePayload.gender || 'M',
            roles_id: profilePayload.roles_id || []
          });

          // Sync with the Topbar automatically upon mounting
          syncProfileContextData({
            first_name: profilePayload.first_name,
            last_name: profilePayload.last_name,
            email: profilePayload.email,
            roles: profilePayload.roles || []
          });
        }
      } catch (err: any) {
        toast.error('Could not map authenticating profile credentials details layout.');
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchCurrentSessionProfile();
  }, [reset, syncProfileContextData]);

  const onSubmitProfileUpdate = async (data: any) => {
    setIsSaving(true);
    try {
      const response: any = await userApi.updateCurrentProfile({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        gender: data.gender
      });
      
      const updatedPayload = response.data?.data || response.data;

      if (response.requestStatus || response.status === 200) {
        toast.success('Your security profile workspace updates are synchronized.');
        
        // Sync saved updates straight into the Topbar state interface
        syncProfileContextData({
          first_name: updatedPayload?.first_name || data.first_name,
          last_name: updatedPayload?.last_name || data.last_name,
          email: updatedPayload?.email || data.email,
          roles: updatedPayload?.roles || []
        });
      } else {
        toast.error(response.message || 'Operation payload rejected.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Transaction drop exception error.');
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
    onSubmitProfileUpdate,
    control,
  };
};