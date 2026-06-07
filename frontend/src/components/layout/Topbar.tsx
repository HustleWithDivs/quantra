import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../assets/Logo-Dark-withTag.png'; 
import {BiMenu} from 'react-icons/bi'
const Topbar=({theme,setTheme, onToggleSidebar }) =>{
  return (
    <Navbar expand="lg" className="bg-body-tertiary border-bottom px-3 w-100">
      <Container fluid className="px-0">
         {/* Hamburger Icon to control expansion */}
        <Button 
          variant="link" 
          className="text-body p-0 me-3 border-0 d-flex align-items-center"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <BiMenu className="fs-3" />
        </Button>
        <Navbar.Brand href="#" className="d-flex align-items-center large-display">
          <img alt="Company Logo" src={logo} width="30" height="30" className="me-2" />
          <span>Quantra</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form className="d-flex ms-auto my-2 my-lg-0 me-3" style={{ width: '400px', maxWidth: '100%' }}>
            <Form.Control
              type="search"
              placeholder="Ask Quantra anything about your supplychain?"
              aria-label="Search"
            />
          </Form>
          
          <Nav className="align-items-center gap-2">
            <Button 
              variant="outline-secondary" 
              className="border-0 px-2"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
            
            <NavDropdown title="User" id="navbarScrollingDropdown" align="end">
              <NavDropdown.Item href="#Examples">Settings</NavDropdown.Item>
              <NavDropdown.Item href="/button-example">Button Example</NavDropdown.Item>
              <NavDropdown.Item href="/input-example">Input Example</NavDropdown.Item>
              <NavDropdown.Item href="/table-example">Table Example</NavDropdown.Item>
              <NavDropdown.Item href="/modal-example">Modal Example</NavDropdown.Item>
              <NavDropdown.Item href="/widget-example">Widget Example</NavDropdown.Item>
              
              <NavDropdown.Divider />
              <NavDropdown.Item href="#settings">Settings</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Topbar;