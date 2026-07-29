import React, { useState } from 'react';
import { Stack } from 'react-bootstrap';
import { BiSave, BiCloudUpload, BiTrash } from 'react-icons/bi';
import { QuantraButton } from '../../components/reusable/QuantraButton';

export default function QuantraButtonExample() {
  const [saving, setSaving] = useState(false);

  const simulateServerSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 2500);
  };

  return (
    <Stack direction="horizontal" gap={3} className="p-4 bg-body-tertiary rounded">
      
      {/* 1. Combined Icon + Text Layout (Leading Icon Position) */}
      <QuantraButton 
        variant="primary" 
        text="Save Metrics" 
        icon={<BiSave className="fs-5" />} 
        isLoading={saving}
        onClick={simulateServerSave}
      />

      {/* 2. Combined Icon + Text Layout (Trailing Icon Position) */}
      <QuantraButton 
        variant="info" 
        text="Upload Logs" 
        icon={<BiCloudUpload className="fs-5" />} 
        iconPosition="end"
      />

      {/* 3. Icon-Only Action Layout (No Text Provided) */}
      <QuantraButton 
        variant="danger" 
        icon={<BiTrash className="fs-5" />} 
        aria-label="Delete Entry Row"
      />

      {/* 4. Fallback Base Text Mode */}
      <QuantraButton variant="secondary">
        Cancel Changes
      </QuantraButton>

    </Stack>
  );
}