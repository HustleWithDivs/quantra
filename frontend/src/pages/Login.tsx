import React from 'react';
import { Container, Row, Col, Form, Card, Alert } from 'react-bootstrap';
import { BiLogInCircle, BiHide, BiShow } from 'react-icons/bi';
import { useLogin } from '../hooks/auth/useLogin';
import logo from '../assets/Logo-Dark-withouttag.png'; 
import { QuantraInputField } from '../components/reusable/QuantraInputField';
import { QuantraButton } from '../components/reusable/QuantraButton';

export const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    errors,
    apiError,
    infoMessage,
    isSubmitting,
    showPassword,
    togglePasswordVisibility,
    onSubmitLogin,
  } = useLogin();

  return (
    <Container fluid className="vh-100 p-0 overflow-hidden bg-body">
      <Row className="g-0 h-100">
        
        {/* LEFT COMPONENT GRID: CORPORATE IDENTITY SIDEBAR BRAND PANEL */}
        <Col lg={6} className="d-none d-lg-flex flex-column justify-content-between p-5 bg-dark text-white position-relative">
          {/* Ambient radial-gradient background element layer */}
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 opacity-25" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 15% 25%, #0d6efd 0%, transparent 45%), radial-gradient(circle at 85% 75%, #6f42c1 0%, transparent 50%)',
              pointerEvents: 'none'
            }} 
          />
          
          {/* Brand Mark Metadata Tracking Header */}
          <div className="d-flex align-items-center gap-2 position-relative z-1">
                      <img alt="Company Logo" src={logo} width="30" height="30" className="me-2" />

            <h4 className="mb-0 fw-bold text-white tracking-tight">Quantra</h4>
          </div>

          {/* Central Hero Typography Catchphrase */}
          <div className="my-auto position-relative z-1" style={{ width:'100%' }}>
            <h1 className="display-5 fw-bold text-white mb-3 lh-sm">
              Manage Your Enterprise Digital Identity Workspace.
            </h1>
            <p className="text-muted text-light fs-5 fw-normal opacity-75">
              Streamline access controls, audit operational lifecycle constraints, and authorize personnel privileges across core modules safely.
            </p>
          </div>

          {/* System Footer Copyright Signatures */}
          <div className="small text-muted position-relative z-1">
            &copy; {new Date().getFullYear()} Quantra Infrastructure.
          </div>
        </Col>

        {/* RIGHT COMPONENT GRID: CARD CONFORMANCE INPUT MATRIX PANEL */}
        <Col xs={12} lg={6} className="d-flex align-items-center justify-content-center p-4 p-md-5 bg-body-tertiary">
          <div className="w-100" style={{ maxWidth: '420px' }}>
            
            {/* View Port Breakpoint Header - Only Displays on Mobile/Tablet Screen Sizes */}
            <div className="d-flex d-lg-none align-items-center gap-2 mb-4">
              <div className="bg-primary rounded p-2 text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px' }}>
                Q
              </div>
              <h5 className="mb-0 fw-bold tracking-tight text-dark">Quantra</h5>
            </div>

            <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-body">
              <Card.Body className="p-4 p-md-5">
                
                {/* Panel Introduction Subtext Layout */}
                <div className="mb-4">
                  <h3 className="fw-bold text-dark mb-1">Account Sign In</h3>
                </div>

                {/* Framework Interceptor Message Alert Banners */}
                {infoMessage && (
                  <Alert variant="info" className="small py-2 text-center border-0 shadow-sm mb-3 fw-medium">
                    {infoMessage}
                  </Alert>
                )}

                {apiError && (
                  <Alert variant="danger" className="small py-2 border-0 shadow-sm mb-3 fw-semibold">
                    {apiError}
                  </Alert>
                )}

                {/* Data Interception Transaction Frame */}
                <Form onSubmit={handleSubmit(onSubmitLogin)}>
                  
                  {/* Account Login Email Text Block Component */}
                  <QuantraInputField
                    label=""
                    name="email"
                    type="email"
                    error={errors.email}
                    placeholder="Email Address"
                    {...register('email')}
                  />

                  {/* Masked Password Variable Field String with Inline Toggle Triggers */}
                  <div className="position-relative mb-3">
                    <QuantraInputField
                      label=""
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      error={errors.password}
                      placeholder="Password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      className="btn position-absolute border-0 p-0 text-muted"
                      onClick={togglePasswordVisibility}
                      style={{ 
                        top: '0.5rem', 
                        right: '0.5rem', 
                        zIndex: 5,
                        background: 'transparent'
                      }}
                      title={showPassword ? 'Hide security string value' : 'Display explicit string data'}
                    >
                      {showPassword ? <BiHide className="fs-5" /> : <BiShow className="fs-5" />}
                    </button>
                  </div>

                  {/* Context Checkboxes and Auxiliary Reminders Elements */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      id="rememberMeCheckboxField"
                      label="Keep active"
                      className="small text-secondary fw-medium cursor-pointer"
                      {...register('rememberMe')}
                    />
                    <a 
                      href="#forgot-password-route" 
                      className="text-decoration-none small fw-semibold text-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Please coordinate credential profile modifications with your network hardware security officer.');
                      }}
                    >
                      Forgot access token?
                    </a>
                  </div>

                  {/* Core Handshake Submit Processing Control Button */}
                  <QuantraButton
                    variant="primary"
                    type="submit"
                    className="w-100 d-flex flex-row justify-content-center"
                    icon={<BiLogInCircle className="fs-5" />}
                    isLoading={isSubmitting}
                    text="Sign In"
                  />
                </Form>
              </Card.Body>
            </Card>
            
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default Login;