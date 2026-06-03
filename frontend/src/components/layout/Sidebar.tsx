import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { BiHomeAlt, BiBarChartSquare, BiUser, BiCog } from 'react-icons/bi';

const Sidebar=({ isExpanded }) =>{
  const location = useLocation();
   const alignmentClass = isExpanded 
      ? "justify-content-start px-3" 
      : "justify-content-center px-0";
  const getNavLinkClass = (path: string) => {
    const baseClass = `d-flex text-left align-items-center rounded mb-1 navigation-link text-nowrap ${alignmentClass}`;
    return location.pathname === path ? `${baseClass} bg-primary text-white` : baseClass;
  };

  return (
    <div 
      className="min-vh-100 bg-body-tertiary border-end p-2 flex-column d-flex"
      style={{ 
        width: isExpanded ? '240px' : '65px', 
        transition: 'width 0.5s ease-in-out' 
      }}
    >
      <Nav className="flex-column flex-grow-1 align-items-start w-100">
        <Nav.Link as={Link} to="/dashboard" className={`${getNavLinkClass('/dashboard')} w-100`}>
          <BiHomeAlt className="fs-4 flex-shrink-0" />
          <span 
            className={`ms-3 fw-medium transition-all ${isExpanded ? 'd-inline-block' : 'd-none'}`}
          >
            Overview
          </span>
        </Nav.Link>
        
        <Nav.Link as={Link} to="/master-data" className={`${getNavLinkClass('/master-data')} w-100`}>
          <BiBarChartSquare className="fs-4 flex-shrink-0" />
          <span 
            className={`ms-3 fw-medium transition-all ${isExpanded ? 'd-inline-block' : 'd-none'}`}
          >
            Master Data
          </span>
        </Nav.Link>

        <Nav.Link as={Link} to="/product-data" className={`${getNavLinkClass('/product-data')} w-100`}>
          <BiUser className="fs-4 flex-shrink-0" />
          <span 
            className={`ms-3 fw-medium transition-all ${isExpanded ? 'd-inline-block' : 'd-none'}`}
          >
            Product Data
          </span>
        </Nav.Link>

        <Nav.Link as={Link} to="/customer" className={`${getNavLinkClass('/customer')} w-100`}>
          <BiCog className="fs-4 flex-shrink-0" />
          <span 
            className={`ms-3 fw-medium transition-all ${isExpanded ? 'd-inline-block' : 'd-none'}`}
          >
            Customer
          </span>
        </Nav.Link>

        <Nav.Link as={Link} to="/user-management" className={`${getNavLinkClass('/user-management')} w-100`}>
          <BiCog className="fs-4 flex-shrink-0" />
          <span 
            className={`ms-3 fw-medium transition-all ${isExpanded ? 'd-inline-block' : 'd-none'}`}
          >
            User Management
          </span>
        </Nav.Link>
      </Nav>
    </div>
  );
}


export default Sidebar;
