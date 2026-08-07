import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, Card, Row, Col, Alert } from 'react-bootstrap';

// Import our custom type-safe reusable design elements
import { QuantraInputField } from '../../components/reusable/QuantraInputField';
import { QuantraSearchBox } from '../../components/reusable/QuantraSearchBox';
import { QuantraSelectField } from '../../components/reusable/QuantraSelectField';
import { QuantraButton } from '../../components/reusable/QuantraButton';

// 1. Declare the comprehensive form validation requirements using Yup
const validationSchema = yup.object({
  username: yup.string().min(3, 'Username must be at least 3 characters.').required('Username is required.'),
  biography: yup.string().min(10, 'Biography requires at least 10 characters.').required('Biography is required.'),
  voucherCode: yup.string().required('A verification voucher code is required.'),
  globalSearchQuery: yup.string().required('Please enter a search query query to run diagnostics.'),
  department: yup.string().required('Please select an operational department workflow.'),
  accessNodes: yup.array().of(yup.string().required()).min(1, 'Select at least one network access node.').required()
}).required();

// 2. Extract and infer the strict TypeScript interface model directly from the validation schema
type WorkspaceFormDataType = yup.InferType<typeof validationSchema>;

// Mock Select Data Options
const departmentOptions: QuantraSelectOption[] = [
  { value: 'logistics', label: 'Global Logistics Hub' },
  { value: 'analytics', label: 'Predictive Data Operations' },
  { value: 'security', label: 'Cyber Infrastructure Shield' }
];

const networkNodeOptions: QuantraSelectOption[] = [
  { value: 'node-alpha', label: 'Alpha Stream Gateway' },
  { value: 'node-beta', label: 'Beta Cluster Storage' },
  { value: 'node-gamma', label: 'Gamma Core Pipeline' }
];

export default function QuantraQuantraInputFieldExample() {
  // 3. Initialize React Hook Form using our inferred TypeScript schema model 
  const { register, control, handleSubmit, formState: { errors } } = useForm<WorkspaceFormDataType>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: '',
      biography: '',
      voucherCode: '',
      globalSearchQuery: '',
      department: '',
      accessNodes: []
    }
  });

  const handleFormSubmission = (data: WorkspaceFormDataType) => {
    console.log('✅ Form submission successful! Validated Data Payload Matrix:', data);
    alert('Form payload validated successfully with strict TypeScript validation constraints.');
  };

  const verifyVoucherOnServer = () => {
    console.log('Dispatching background validation check for voucher systems...');
  };

  const executeImmediateSearchQuery = () => {
    console.log('Triggering ad-hoc catalog lookup optimization loop directly from search icon click...');
  };

  return (
    <Card className="p-4 border-0 shadow-sm mx-auto my-5 text-start" style={{ maxWidth: '750px' }}>
      <Card.Header className="bg-transparent border-0 ps-0 mb-3">
        <h3 className="large-display mb-1">System Node Registry</h3>
        <p className="text-muted small mb-0">Unified validation test environment for custom component building tokens</p>
      </Card.Header>

      <Form onSubmit={handleSubmit(handleFormSubmission)}>
        <Row>
          <Col md={6}>
            {/* Standard Text Mode Input */}
            <QuantraInputField
              label="Account Username Callsign"
              placeholder="e.g. QUANTRA_OPERATOR"
              error={errors.username}
              {...register('username')}
            />
          </Col>
          <Col md={6}>
            {/* Custom Interactive SearchBox Component */}
            <QuantraSearchBox
              label="Asset Core Lookup Feed"
              placeholder="Search serial telemetry ids..."
              error={errors.globalSearchQuery}
              onSearchClick={executeImmediateSearchQuery}
              {...register('globalSearchQuery')}
            />
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            {/* Custom Single-Select Mode Field using React-Select wrapper */}
            <QuantraSelectField
              label="Assigned Operational Department"
              name="department"
              options={departmentOptions}
              control={control}
              error={errors.department}
              placeholder="Select structural tier..."
            />
          </Col>
          <Col md={6}>
            {/* Custom Multi-Select Mode Field with automatic array parsing integration */}
            <QuantraSelectField
              label="Authorized Cluster Access Matrix"
              name="accessNodes"
              options={networkNodeOptions}
              isMulti={true}
              control={control}
              error={errors.accessNodes}
              placeholder="Map permission targets..."
            />
          </Col>
        </Row>

        {/* Input Group with Trailing Action Button Mode */}
        <QuantraInputField
          label="Secure Ledger Corporate Voucher"
          type="button"
          buttonText="Validate"
          placeholder="SYS-BETA-4829"
          onButtonClick={verifyVoucherOnServer}
          error={errors.voucherCode}
          {...register('voucherCode')}
        />

        {/* Multi-line Textarea Entry Field */}
        <QuantraInputField
          label="Infrastructure Payload Blueprint Manifest"
          type="textarea"
          rows={3}
          placeholder="Document the target configuration matrix specifications in detail..."
          error={errors.biography}
          {...register('biography')}
        />

        {/* If any schema field triggers validation failures, display a summary header box alert */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="danger" className="py-2 px-3 small border-0 mb-3">
            ⚠️ Form submission blocked. Please review highlighted network infrastructure fields.
          </Alert>
        )}

        {/* Custom Loading-Aware Action Button Integration */}
        <div className="d-flex justify-content-end mt-4">
          <QuantraButton type="submit" variant="success" className="px-5 py-2 fw-medium">
            Commit Changes to Mesh
          </QuantraButton>
        </div>
      </Form>
    </Card>
  );
}
