import React, { useEffect, useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { productApi, type ProductVariant } from '../../api/productApi';
import { api } from '../../api/axiosInstance';
import { QuantraSelectField } from '../reusable/QuantraSelectField';
import { useForm } from 'react-hook-form';

interface VariantModalProps {
  show: boolean;
  onClose: () => void;
  productId: string;
  selectedVariant: ProductVariant | null; // Null means we are in "Create" mode
  onSuccess: () => void;
}

export const VariantModal: React.FC<VariantModalProps> = ({ show, onClose, productId, selectedVariant, onSuccess }) => {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: { color_id: '', size_id: '' }
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [resColors, resSizes] = await Promise.all([
          api.get('/color').catch(() => ({ data: { data: [] } })),
          api.get('/size').catch(() => ({ data: { data: [] } }))
        ]);
        setColors(resColors.data.data.map((c: any) => ({ value: c.color_id, label: c.color_name })));
        setSizes(resSizes.data.data.map((s: any) => ({ value: s.size_id, label: s.size_name })));
      } catch (err) {
        toast.error("Failed to load attributes.");
      }
    };
    if (show) fetchOptions();
  }, [show]);

  useEffect(() => {
    if (selectedVariant) {
      reset({
        color_id: selectedVariant.color_id || '',
        size_id: selectedVariant.size_id || ''
      });
    } else {
      reset({ color_id: '', size_id: '' });
    }
    setUploadedFiles([]);
  }, [selectedVariant, show, reset]);

  const onFormSubmit = async (data: any) => {
    setIsSaving(true);
    try {
      let res;
      const payload = { ...data, image_files: uploadedFiles };
      if (selectedVariant) {
        res = await productApi.updateVariant(selectedVariant.product_variant_id, payload);
      } else {
        res = await productApi.createVariant(productId, payload);
      }
      
      if (res.requestStatus) {
        toast.success(selectedVariant ? "Variant details updated." : "New Variant appended successfully.");
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to process variant data modifications.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit(onFormSubmit)}>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5 fw-bold">{selectedVariant ? 'Edit Variant Configuration' : 'Add New Variant Option'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            <QuantraSelectField name="color_id" control={control} label="Color Variant" options={colors} placeholder="-- Choose Color --" />
            <QuantraSelectField name="size_id" control={control} label="Size Dimension" options={sizes} placeholder="-- Choose Size --" />
            
            <Form.Group>
              <Form.Label className="small fw-bold text-secondary">Upload Variant Graphic Media Assets</Form.Label>
              <Form.Control type="file" multiple accept="image/*" onChange={(e: any) => e.target.files && setUploadedFiles(Array.from(e.target.files))} />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" size="sm" onClick={onClose}>Discard</Button>
          <Button variant="success" size="sm" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving Changes...' : 'Save Configuration'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};