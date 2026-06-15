import React from 'react';
import { Container, Card, Row, Col, Form, Spinner } from 'react-bootstrap';
import { BiUserCircle, BiCheckShield } from 'react-icons/bi';
import { useSettingsForm } from '../hooks/profile/useSettingsForm';
import { QuantraInputField } from '../components/reusable/QuantraInputField';
import { QuantraButton } from '../components/reusable/QuantraButton';
import { GenderOptions } from '../utilities/UserManagement';
import { QuantraSelectField } from '../components/reusable/QuantraSelectField';

export const Settings: React.FC = () => {
  const { register, handleSubmit, errors, isPageLoading, isSaving, onSubmitProfileUpdate, control } = useSettingsForm();

  return (
    <Container fluid className="py-4 px-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-2">
            <BiUserCircle className="fs-3 text-primary" />
            <h4 className="mb-0 fw-bold">Profile Settings</h4>
          </div>
        </Col>
      </Row>

      {isPageLoading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5">
          <Spinner animation="border" variant="primary" className="mb-2" />
          <span className="text-muted small fw-medium">Retrieving active profile variables...</span>
        </div>
      ) : (
        <Row className= "d-flex flex-row">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-3">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit(onSubmitProfileUpdate)}>
                  <Row>
                    <Col md={6}>
                      <QuantraInputField 
                        label="First Name" 
                        error={errors.first_name} 
                        {...register('first_name')} 
                        className='text-left'
                      />
                    </Col>
                   
                    <Col md={6}>
                      <QuantraInputField 
                        label="Last Name" 
                        error={errors.last_name} 
                        {...register('last_name')} 
                         className='text-left'
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <QuantraInputField 
                        label="Email Address" 
                        type="email" 
                        error={errors.email} 
                        {...register('email')} 
                         className='text-left'
                      />
                    </Col>
                   
                    <Col md={6}>
                       <QuantraSelectField
                                                    label="Gender"
                                                    
                                                    options={GenderOptions}
                                                    control={control}
                                                    error={errors.gender}
                                                    placeholder="Select Gender ..."
                                                    {...register('gender')}
                                                  />
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end mt-3">
                    <QuantraButton 
                      variant="primary" 
                      type="submit" 
                      isLoading={isSaving} 
                      icon={<BiCheckShield className="fs-5" />} 
                      text="Save Profile Changes" 
                    />
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Settings;