import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productApi, type ProductPayload } from '../../api/productApi';
import { api } from '../../api/axiosInstance';
import type { QunatraSelectOption } from '../../components/reusable/QuantraSelectField';

const productValidationSchema = yup.object().shape({
  sku: yup.string().required('SKU identifier code is required'),
  product_name: yup.string().required('Product tracking name is required'),
  upc_ean: yup.string().nullable(),
  short_description: yup.string().nullable(),
  long_description: yup.string().nullable(),
  barcode: yup.string().nullable(),
  dimensions: yup.string().nullable(),
  uom: yup.string().nullable(),
  weight: yup.number().typeError('Weight must be numeric').nullable().transform((v, o) => o === '' ? null : v),
  min_order_qty: yup.number().typeError('Must be an integer').integer().min(1, 'Minimum order quantity is 1').required('Minimum order qty is required'),
  
  // Structural Taxonomy Identifiers
  business_category_id: yup.string().required('Business category mapping required'),
  department_id: yup.string().required('Department mapping required'),
  category_id: yup.string().required('Category hierarchy mapping required'),
  sub_category_id: yup.string().required('Sub-category segment mapping required'),
  product_type_id: yup.string().required('Product operational type code required'),
  
  // Auxiliary Reference Dropdowns
  brand_id: yup.string().nullable(),
  supplier_id: yup.string().nullable(),
  material_id: yup.string().nullable(),
  color_id: yup.string().nullable(),
  size_id: yup.string().nullable(),
  
  // Financial Logistics Flags
  cost_price: yup.number().typeError('Must be numeric value').min(0).required('Cost price is required'),
  selling_price: yup.number().typeError('Must be numeric value').min(0).required('Selling price is required'),
  stock_qty: yup.number().typeError('Must be an integer').integer().min(0).required('Initial inventory allocation is required'),
  is_active: yup.boolean().default(true),
  is_taxable: yup.boolean().default(true),
  is_perishable: yup.boolean().default(false),
});

export const useProductForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEditMode = !!productId;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Selection Dropdown States
  const [businessCategories, setBusinessCategories] = useState<QunatraSelectOption[]>([]);
  const [departments, setDepartments] = useState<QunatraSelectOption[]>([]);
  const [categories, setCategories] = useState<QunatraSelectOption[]>([]);
  const [subCategories, setSubCategories] = useState<QunatraSelectOption[]>([]);
  const [productTypes, setProductTypes] = useState<QunatraSelectOption[]>([]);
  
  // Auxiliary Metadata Select Lookups (Ready for API Integration)
  const [brands, setBrands] = useState<QunatraSelectOption[]>([]);
  const [suppliers, setSuppliers] = useState<QunatraSelectOption[]>([]);
  const [materials, setMaterials] = useState<QunatraSelectOption[]>([]);
  const [colors, setColors] = useState<QunatraSelectOption[]>([]);
  const [sizes, setSizes] = useState<QunatraSelectOption[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, control } = useForm({
    resolver: yupResolver(productValidationSchema),
    defaultValues: { is_active: true, is_taxable: true, is_perishable: false, min_order_qty: 1 }
  });

  const watchBusinessCategory = watch('business_category_id');
  const watchDepartment = watch('department_id');
  const watchCategory = watch('category_id');
  const watchSubCategory = watch('sub_category_id');

  // Load Baseline Data & Meta Dropdowns
  useEffect(() => {
    const loadStaticLookups = async () => {
      try {
        const [resBC, resBrands, resSuppliers, resMaterials, resColors, resSizes] = await Promise.all([
          api.get('/business-category'),
          api.get('/brands').catch(() => ({ data: { data: [] } })), // Fallback to empty until endpoints are live
          api.get('/suppliers').catch(() => ({ data: { data: [] } })),
          api.get('/materials').catch(() => ({ data: { data: [] } })),
          api.get('/colors').catch(() => ({ data: { data: [] } })),
          api.get('/sizes').catch(() => ({ data: { data: [] } }))
        ]);

        setBusinessCategories(resBC.data.data.map((b: any) => ({ value: b.business_category_id, label: b.business_category_name })));
        setBrands(resBrands.data.data.map((b: any) => ({ value: b.brand_id, label: b.brand_name })));
        setSuppliers(resSuppliers.data.data.map((s: any) => ({ value: s.supplier_id, label: s.supplier_name })));
        setMaterials(resMaterials.data.data.map((m: any) => ({ value: m.material_id, label: m.material_name })));
        setColors(resColors.data.data.map((c: any) => ({ value: c.color_id, label: c.color_name })));
        setSizes(resSizes.data.data.map((s: any) => ({ value: s.size_id, label: s.size_value })));
      } catch (err) {
        toast.error('Failed to pre-fetch foundational catalog variables.');
      }
    };
    loadStaticLookups();
  }, []);

  // Cascading Dropdown Triggers
  useEffect(() => {
    if (!watchBusinessCategory) { setDepartments([]); return; }
    api.get('/departments', { params: { business_category_id: watchBusinessCategory } })
      .then(res => setDepartments(res.data.data.map((d: any) => ({ value: d.department_id, label: d.department_name }))))
      .catch(() => setDepartments([]));
  }, [watchBusinessCategory]);

  useEffect(() => {
    if (!watchDepartment) { setCategories([]); return; }
    api.get('/category', { params: { department_id: watchDepartment } })
      .then(res => setCategories(res.data.data.map((c: any) => ({ value: c.category_id, label: c.category_name }))))
      .catch(() => setCategories([]));
  }, [watchDepartment]);

  useEffect(() => {
    if (!watchCategory) { setSubCategories([]); return; }
    api.get('/sub-category', { params: { category_id: watchCategory } })
      .then(res => setSubCategories(res.data.data.map((s: any) => ({ value: s.sub_category_id, label: s.sub_category_name }))))
      .catch(() => setSubCategories([]));
  }, [watchCategory]);

  useEffect(() => {
    if (!watchSubCategory) { setProductTypes([]); return; }
    api.get('/product-type', { params: { sub_category_id: watchSubCategory } })
      .then(res => setProductTypes(res.data.data.map((p: any) => ({ value: p.product_type_id, label: p.product_type }))))
      .catch(() => setProductTypes([]));
  }, [watchSubCategory]);

  // Edit Mode Loader Routine
  useEffect(() => {
    if (!isEditMode) return;
    productApi.getProductById(productId!).then(res => {
      if (res.requestStatus) reset(res.data as any);
    }).catch(() => toast.error('Error fetching baseline product data context.'));
  }, [productId, isEditMode, reset]);

  const handleFormSubmission = async (data: any) => {
    setIsSaving(true);
    const payload: ProductPayload = { ...data, image_files: uploadedFiles };
    try {
      const res = isEditMode 
        ? await productApi.updateProduct(productId!, payload)
        : await productApi.createProduct(payload);

      if (res.requestStatus) {
        toast.success(isEditMode ? 'Core product entry modified.' : 'Product and starting variant initialized.');
        navigate('/product-data');
      } else {
        toast.error(res.message || 'Payload variables rejected.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to preserve workspace settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    currentStep,
    setCurrentStep,
    isSaving,
    isEditMode,
    businessCategories,
    departments,
    categories,
    subCategories,
    productTypes,
    brands,
    suppliers,
    materials,
    colors,
    sizes,
    uploadedFiles,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) setUploadedFiles(Array.from(e.target.files));
    },
    handleFormSubmission,
    cancelForm: () => navigate('/product-data'),
    control
  };
};