import React from 'react';
import { Button, Container, Form, Nav, Navbar, NavDropdown, Spinner } from 'react-bootstrap';
import { BiMenu, BiLogOutCircle, BiCog } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo-Dark-withTag.png'; 
import { useLogout } from '../../hooks/auth/useLogout';
import { useAuth } from '../../context/AuthContext'; // Import your authentication provider hook
import Avatar from '../auth/Avatar';

interface TopbarProps {
  theme: string;
  setTheme: (theme: string) => void;
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ theme, setTheme, onToggleSidebar }) => {
  const navigate = useNavigate();
  const { handleExecuteLogout, isLoggingOut } = useLogout();
  const { user } = useAuth(); // Extract active user properties dictionary from global state cache
  
  // Dynamically resolve display naming string context based on loaded active models
  const userDisplayName = user?.first_name?`${user?.first_name} ${user?.last_name}`:'Quantra Operator';

  return (
    <Navbar expand="lg" className="bg-body-tertiary border-bottom px-3 w-100">
      <Container fluid className="px-0">
        
        <Button variant="link" className="text-body p-0 me-3 border-0 d-flex align-items-center" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
          <BiMenu className="fs-3" />
        </Button>

        <Navbar.Brand href="#" className="d-flex align-items-center large-display">
          <img alt="Company Logo" src={logo} width="30" height="30" className="me-2" />
          <span className="fw-semibold">Quantra</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          
          <Form className="d-flex ms-auto my-2 my-lg-0 me-3" style={{ width: '400px', maxWidth: '100%' }}>
            <Form.Control type="search" placeholder="Ask Quantra anything about your supplychain?" aria-label="Search" className="form-control-sm" />
          </Form>
          
          <Nav className="align-items-center gap-2">
            <Button variant="outline-secondary" className="border-0 px-2" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
            
            {/* DYNAMIC DROPDOWN MENU TITLE GENERATION BASED ON ACTIVE ACCOUNT */}
            <NavDropdown 
              title={
                isLoggingOut ? (
                  <Spinner animation="border" size="sm" variant="secondary" className="me-1" />
                ) : (
                  <span className="">
                     <Avatar name={userDisplayName}/>
                  </span>
                )
              } 
              id="navbarScrollingDropdown" 
              align="end"
            >
              {/* Settings Route Link Redirection */}
              <NavDropdown.Item onClick={() => navigate('/settings')}>
                <BiCog className="me-2 text-secondary" /> Settings Profile
              </NavDropdown.Item>

              
              
              <NavDropdown.Divider />
              
              <NavDropdown.Item onClick={handleExecuteLogout} disabled={isLoggingOut} className="text-danger fw-medium d-flex align-items-center">
                <BiLogOutCircle className="me-2 fs-5" /> 
                {isLoggingOut ? 'Disconnecting Core Tokens...' : 'Logout Session'}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Topbar;