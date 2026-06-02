import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { BiHomeAlt, BiBarChartSquare, BiUser, BiCog } from 'react-icons/bi';

const Sidebar=() =>{
  const location = useLocation();
  const getNavLinkClass = (path: string) => {
    const baseClass = "d-flex align-items-center rounded mb-1 navigation-link";
    return location.pathname === path ? `${baseClass} bg-primary text-white` : baseClass;
  };

  return (
    <Nav className="flex-column h-100">
      {/* Root points to dashboard */}
      <Nav.Link as={Link} to="/dashboard" className={getNavLinkClass('/dashboard')}>
        <BiHomeAlt className="fs-4 me-md-3" />
        <span className="d-none d-md-inline">Overview</span>
      </Nav.Link>
      
      <Nav.Link as={Link} to="/master-data" className={getNavLinkClass('/master-data')}>
        <BiBarChartSquare className="fs-4 me-md-3" />
        <span className="d-none d-md-inline">Master Data</span>
      </Nav.Link>

      <Nav.Link as={Link} to="/product-data" className={getNavLinkClass('/product-data')}>
        <BiUser className="fs-4 me-md-3" />
        <span className="d-none d-md-inline">Product Data</span>
      </Nav.Link>

      <Nav.Link as={Link} to="/customer" className={getNavLinkClass('/customer')}>
        <BiCog className="fs-4 me-md-3" />
        <span className="d-none d-md-inline">Customer</span>
      </Nav.Link>
      <Nav.Link as={Link} to="/user-management" className={getNavLinkClass('/user-management')}>
        <BiCog className="fs-4 me-md-3" />
        <span className="d-none d-md-inline">User Management</span>
      </Nav.Link>
    </Nav>
  );
}

export default Sidebar;
