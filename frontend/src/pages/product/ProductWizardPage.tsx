import React from 'react';
import { Container, Row, Col, Card, Form, ProgressBar, Alert } from 'react-bootstrap';
import { BiChevronLeft, BiChevronRight, BiCheckCircle, BiArrowBack, BiErrorCircle } from 'react-icons/bi';
import { useProductForm } from '../../hooks/product/useProductForm';
import { QuantraButton } from '../../components/reusable/QuantraButton';
import { QuantraInputField } from '../../components/reusable/QuantraInputField';
import { QuantraSelectField } from '../../components/reusable/QuantraSelectField';

export const ProductWizardPage: React.FC = () => {
  const {
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
    handleFileChange,
    uploadedFiles,
    handleFormSubmission,
    cancelForm, control
  } = useProductForm();

  const errorKeys = Object.keys(errors);

  return (
    <Container fluid className="py-4 px-4 bg-body-tertiary" style={{ minHeight: '85vh' }}>
      <Row className="mb-3">
        <Col>
          <button onClick={cancelForm} className="btn btn-link text-decoration-none p-0 d-flex align-items-center gap-1 text-secondary">
            <BiArrowBack /> Back to Master Grid Inventory
          </button>
          <h4 className="fw-bold text-dark mt-2">
            {isEditMode ? 'Modify Product Context' : 'Provision New Core Product Profile'}
          </h4>
        </Col>
      </Row>

      <Row>
        <Col lg={9} className="mx-auto">
          {errorKeys.length > 0 && (
            <Alert variant="danger" className="d-flex align-items-center gap-2 shadow-sm rounded-3 mb-3">
              <BiErrorCircle className="fs-4 flex-shrink-0" />
              <div>
                <strong>Form Verification Blocked:</strong> Missing or invalid required fields are highlighted across steps. Please review all variables.
              </div>
            </Alert>
          )}

          <Card className="border-0 shadow-sm rounded-3 mb-4">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="small text-muted fw-bold">Step {currentStep} of 3</span>
                <span className="small badge bg-primary-subtle text-primary rounded-pill">
                  {currentStep === 1 ? 'Core Metadata & Hierarchy' : currentStep === 2 ? 'Operational Logistics & Valuation' : 'Visual Assets & Variants'}
                </span>
              </div>
              <ProgressBar now={(currentStep / 3) * 100} variant="primary" className="mb-4" style={{ height: '6px' }} />

              <Form onSubmit={handleSubmit(handleFormSubmission)}>
                
                {/* --- STEP 1: IDENTITY, TAXONOMY, DESCRIPTIONS & CODES --- */}
                {currentStep === 1 && (
                  <div className="animate-fade-in">
                    <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">Step 1: Primary Profile Codes & Taxonomies</h5>
                    
                    <h6 className="text-secondary fw-semibold mb-2">Identification Tracking</h6>
                    <Row className="g-3 mb-4">
                      <Col md={4}>
                        <QuantraInputField label="SKU Allocation Code *" placeholder="e.g., QNTR-SHOE-001" error={errors.sku} {...register('sku')} />
                      </Col>
                      <Col md={4}>
                        <QuantraInputField label="Product Display Name *" placeholder="e.g., Running Shoes" error={errors.product_name} {...register('product_name')} />
                      </Col>
                      <Col md={4}>
                        <QuantraInputField label="UPC / EAN System Code" placeholder="e.g., 889694001" error={errors.upc_ean} {...register('upc_ean')} />
                      </Col>
                    </Row>

                    <h6 className="text-secondary fw-semibold mb-2">Cascading Structural Taxonomy</h6>
                    <Row className="g-3 mb-4">
                      <Col md={4}>
                        <QuantraSelectField control={control} label="Business Category *" options={businessCategories} error={errors.business_category_id} placeholder="-- Choose --" {...register('business_category_id')} />
                      </Col>
                      <Col md={4}>
                        <QuantraSelectField control={control} label="Department *" options={departments} error={errors.department_id} placeholder="-- Choose --" disabled={!departments.length} {...register('department_id')} />
                      </Col>
                      <Col md={4}>
                        <QuantraSelectField control={control} label="Category *" options={categories} error={errors.category_id} placeholder="-- Choose --" disabled={!categories.length} {...register('category_id')} />
                      </Col>
                      <Col md={6}>
                        <QuantraSelectField control={control} label="Sub-Category *" options={subCategories} error={errors.sub_category_id} placeholder="-- Choose --" disabled={!subCategories.length} {...register('sub_category_id')} />
                      </Col>
                      <Col md={6}>
                        <QuantraSelectField control={control} label="Product Operational Type Tier *" options={productTypes} error={errors.product_type_id} placeholder="-- Choose --" disabled={!productTypes.length} {...register('product_type_id')} />
                      </Col>
                    </Row>

                    <h6 className="text-secondary fw-semibold mb-2">Extended Profiling Context Details</h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <QuantraSelectField control={control} label="Brand / Label Assignment" options={brands} error={errors.brand_id} placeholder="-- Assign Brand --" {...register('brand_id')} />
                      </Col>
                      <Col md={6}>
                        <QuantraSelectField control={control} label="Core Sourcing Supplier" options={suppliers} error={errors.supplier_id} placeholder="-- Select Sourcing Vendor --" {...register('supplier_id')} />
                      </Col>
                      <Col md={6}>
                        <QuantraSelectField control={control} label="Baseline Structural Material" options={materials} error={errors.material_id} placeholder="-- Select Composition --" {...register('material_id')} />
                      </Col>
                      <Col md={12}>
                        <QuantraInputField label="Short Catchy Description Text" placeholder="Enter continuous summary brief context" error={errors.short_description} {...register('short_description')} />
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="small fw-bold text-secondary">Complete Product Technical Specifications (Long Description)</Form.Label>
                          <Form.Control as="textarea" rows={3} placeholder="Provide deep technical information regarding this asset tracking profile node..." {...register('long_description')} isInvalid={!!errors.long_description} />
                          {errors.long_description && <Form.Control.Feedback type="invalid">{errors.long_description.message}</Form.Control.Feedback>}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                {/* --- STEP 2: FINANCES, STOCK, PACKAGING, UOM & SHIPPING MEASURES --- */}
                {currentStep === 2 && (
                  <div className="animate-fade-in">
                    <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">Step 2: Valuation, Packaging Configuration & Controls</h5>
                    
                    <h6 className="text-secondary fw-semibold mb-2">Financial Accounting Matrix</h6>
                    <Row className="g-3 mb-4">
                      <Col md={4}>
                        <QuantraInputField label="Cost Price *" type="number" step="0.01" error={errors.cost_price} {...register('cost_price')} />
                      </Col>
                      <Col md={4}>
                        <QuantraInputField label="Selling Retail Price *" type="number" step="0.01" error={errors.selling_price} {...register('selling_price')} />
                      </Col>
                      <Col md={4}>
                        <QuantraInputField label="Initial Stock Allocation Qty *" type="number" error={errors.stock_qty} {...register('stock_qty')} />
                      </Col>
                    </Row>

                    <h6 className="text-secondary fw-semibold mb-2">Logistics Shipping Attributes</h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <QuantraInputField label="Minimum Order Qty *" type="number" error={errors.min_order_qty} {...register('min_order_qty')} />
                      </Col>
                      <Col md={6}>
                        <QuantraInputField label="Unit of Measurement (UOM)" placeholder="e.g., PCS, BOX, KG" error={errors.uom} {...register('uom')} />
                      </Col>
                      <Col md={6}>
                        <QuantraInputField label="Net Weight Unit Layout" type="number" step="0.01" placeholder="e.g., 1.45" error={errors.weight} {...register('weight')} />
                      </Col>
                      <Col md={6}>
                        <QuantraInputField label="Dimension Rules (LxWxH)" placeholder="e.g., 30x20x15 cm" error={errors.dimensions} {...register('dimensions')} />
                      </Col>
                      <Col md={12}>
                        <QuantraInputField label="Physical Identification Barcode Alpha String" placeholder="Incorporate laser print scanning code data" error={errors.barcode} {...register('barcode')} />
                      </Col>
                      
                      <Col md={12} className="d-flex gap-4 mt-3 py-3 bg-light rounded px-3 border">
                        <Form.Check type="checkbox" label="Is Product Active" id="is_active" {...register('is_active')} />
                        <Form.Check type="checkbox" label="Taxable Goods Profile" id="is_taxable" {...register('is_taxable')} />
                        <Form.Check type="checkbox" label="Perishable Asset Class" id="is_perishable" {...register('is_perishable')} />
                      </Col>
                    </Row>
                  </div>
                )}

                {/* --- STEP 3: REUSABLE VARIANT SELECT dropdowns & MEDIA Multi-FILE --- */}
                {currentStep === 3 && (
                  <div className="animate-fade-in">
                    <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">Step 3: Variant Options & Asset Streams</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <QuantraSelectField control={control} label="Color Variation Mapping Dropdown" options={colors} error={errors.color_id} placeholder="-- Select Color --" {...register('color_id')} />
                      </Col>
                      <Col md={6}>
                        <QuantraSelectField control={control} label="Size Dimension Option Dropdown" options={sizes} error={errors.size_id} placeholder="-- Select Size --" {...register('size_id')} />
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-2">
                          <Form.Label className="small fw-bold text-success">Select Multiple Local Image Files for Variant Storage Array</Form.Label>
                          <Form.Control type="file" multiple accept="image/*" onChange={handleFileChange} disabled={isEditMode} />
                          <Form.Text className="text-muted d-block mt-1">
                            Choose one or multiple graphic files directly. They are instantly uploaded into your secure local runtime deployment storage directories.
                          </Form.Text>
                        </Form.Group>
                        {uploadedFiles.length > 0 && (
                          <div className="p-3 bg-light rounded border border-dashed mt-2">
                            <span className="small fw-bold text-secondary d-block mb-2">Selected Assets Pending Processing Upload Queue:</span>
                            <ul className="small text-primary mb-0 ps-3">
                              {uploadedFiles.map((f, i) => <li key={i}>{f.name} ({Math.round(f.size / 1024)} KB)</li>)}
                            </ul>
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}

                {/* --- NAVIGATION FOOTER TRAIL --- */}
                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <QuantraButton type="button" variant="outline-secondary" text="Previous Step" icon={<BiChevronLeft />} disabled={currentStep === 1} onClick={() => setCurrentStep(prev => prev - 1)} />
                  {currentStep < 3 ? (
                    <QuantraButton type="button" variant="primary" text="Next Step" icon={<BiChevronRight />} onClick={() => setCurrentStep(prev => prev + 1)} />
                  ) : (
                    <QuantraButton type="submit" variant="success" text={isSaving ? 'Synchronizing Stream...' : 'Submit Form Payload'} icon={<BiCheckCircle />} disabled={isSaving} />
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductWizardPage;