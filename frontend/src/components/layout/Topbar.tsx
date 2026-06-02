import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../assets/Logo-Dark-withTag.png'; 

const Topbar=({theme,setTheme}) =>{
  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed='top'>
      <Container fluid>
        <Navbar.Brand href="#"><img
            alt="Company Logo"
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
          />Quantra</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' , maxWidth:'99%' }}
            navbarScroll
          >
             <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Ask Quantra anything about your supplychain?"
              className="me-2"
              aria-label="Search"
            />
          </Form>
          <Button 
          variant="outline-primary" 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
         {theme === 'light' ? '🌙 ' : '☀️'}
        </Button>
            <NavDropdown title="User" id="navbarScrollingDropdown" drop='down-centered' align="end">
              <NavDropdown.Item href="#action4">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Logout
              </NavDropdown.Item>
            </NavDropdown>

          </Nav>
         
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Topbar;