import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, Collapse, Dropdown } from 'react-bootstrap';
import { 
  BiHomeAlt, 
  BiBarChartSquare, 
  BiPackage, 
  BiGitBranch, 
  BiGroup, 
  BiChevronDown,
  
} from 'react-icons/bi';
import { FaUserAlt, FaUserShield, FaShieldAlt } from "react-icons/fa";


interface SidebarProps {
  isExpanded: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded }) => {
  const location = useLocation();
  
  // Track open/close state of the nested inline dropdown block (used when expanded)
  const [userMenuOpen, setUserMenuOpen] = useState(false);
// Track open/close state of the nested inline dropdown block (used when expanded)
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);

  // Auto-expand the internal menu if the current path is a child route (only when sidebar is open)
  useEffect(() => {
    if (isExpanded && (location.pathname === '/user-management/users' || location.pathname === '/user-management/roles')) {
      setUserMenuOpen(true);
    }
  }, [location.pathname, isExpanded]);

  // Auto-expand the internal menu if the current path is a child route (only when sidebar is open)
  useEffect(() => {
    if (isExpanded && (location.pathname === '/master-data/brand' || location.pathname === '/master-data/supplier')) {
      setMasterMenuOpen(true);
    }
  }, [location.pathname, isExpanded]);

  // Handle alignment paddings gracefully based on main sidebar state
  const alignmentClass = isExpanded 
    ? "justify-content-start px-3" 
    : "justify-content-center px-0";
  // Dynamic style helper for standard parent navigation links
  const getNavLinkClass = (path: string) => {
    const baseClass = `d-flex align-items-center rounded mb-1 navigation-link text-nowrap py-2 ${alignmentClass}`;
    return location.pathname?.includes(path) ? `${baseClass} bg-primary text-white` : `${baseClass} text-body`;
  };

  // Dynamic style helper for nested sub-navigation links
  const getSubNavLinkClass = (path: string) => {
    const baseClass = `d-flex align-items-center rounded mb-1 sub-navigation-link text-nowrap py-2 ps-3`;
    return location.pathname === path ? `${baseClass} bg-primary text-white` : `${baseClass} text-body-secondary`;
  };

  return (
    <div 
      className="min-vh-100 bg-body-tertiary border-end p-2 flex-column d-flex position-relative"
      style={{ 
        width: isExpanded ? '240px' : '65px', 
        transition: 'width 0.5s ease-in-out',
        zIndex: 100
      }}
    >
      <Nav className="flex-column flex-grow-1 align-items-start w-100">
        
        {/* 1. Dashboard */}
        <Nav.Link as={Link} to="/dashboard" className={`${getNavLinkClass('/dashboard')} w-100`}>
          <BiHomeAlt className="fs-4 flex-shrink-0" />
          {isExpanded && <span className="ms-3 fw-medium">Dashboard</span>}
        </Nav.Link>
        
        {/* 2. Master Data */}
        {/* <Nav.Link as={Link} to="/master-data" className={`${getNavLinkClass('/master-data')} w-100`}>
          <BiBarChartSquare className="fs-4 flex-shrink-0" />
          {isExpanded && <span className="ms-3 fw-medium">Master Data</span>}
        </Nav.Link> */}
        {/* 2. Master Data Row */}
        <div className="w-100 position-relative">
          {isExpanded ? (
            /* --- EXPANDED MODE: Renders standard inline accordion dropdown --- */
            <>
              <div
                onClick={() => setMasterMenuOpen(!masterMenuOpen)}
                className={getNavLinkClass('/master-data/')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <FaUserShield className="fs-4 flex-shrink-0" />
                  <span className="ms-3 fw-medium">Master Data</span>
                </div>
                <BiChevronDown 
                  className="fs-5" 
                  style={{ 
                    transform: masterMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </div>

              <Collapse in={masterMenuOpen}>
                <div>
                  <div className="d-flex flex-column ms-3 border-start ps-2 mt-1">
                    <Nav.Link as={Link} to="/master-data/brand" className={getSubNavLinkClass('/master-data/brand')}>
                      <FaUserAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Brand</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/master-data/supplier" className={getSubNavLinkClass('/master-data/supplier')}>
                      <FaShieldAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Supplier</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/master-data/material" className={getSubNavLinkClass('/master-data/material')}>
                      <FaShieldAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Material</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/master-data/business-category" className={getSubNavLinkClass('/master-data/business-category')}>
                      <FaShieldAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Business Category</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/master-data/department" className={getSubNavLinkClass('/master-data/department')}>
                      <FaShieldAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Department</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/master-data/category" className={getSubNavLinkClass('/master-data/category')}>
                      <FaShieldAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Category</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/master-data/sub-category" className={getSubNavLinkClass('/master-data/sub-category')}>
                      <FaShieldAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Sub Category</span>
                    </Nav.Link>
                  </div>
                </div>
              </Collapse>
            </>
          ) : (
            /* --- COLLAPSED MODE: Renders a hoverable/clickable Popover Dropdown overlay --- */
            <Dropdown drop="end" className="w-100 d-flex justify-content-center">
              <Dropdown.Toggle 
                variant="transparent" 
                className={`p-0 border-0 d-flex align-items-center justify-content-center position-relative w-100 py-2 rounded  ${
                  masterMenuOpen ? 'bg-primary text-white' : 'text-body'
                }`}
              >
                <FaUserShield className="fs-4 flex-shrink-0" />
                {/* Visual Indicator: Mini chevron overlay signifying that hidden options exist */}
              
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border py-2 px-1 m-0 ms-2 bg-body-tertiary">
                <div className="px-3 py-1 mb-1 border-bottom text-muted small fw-bold">
                  Master Data
                </div>
                <Dropdown.Item 
                  as={Link} 
                  to="/master-data/brand" 
                  className={`rounded d-flex align-items-center px-3 py-2 my-1 ${
                    location.pathname === '/master-data/brand' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaUserAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Brand</span>
                </Dropdown.Item>
                <Dropdown.Item 
                  as={Link} 
                  to="/master-data/supplier" 
                  className={`rounded d-flex align-items-center px-3 py-2 ${
                    location.pathname === '/master-data/supplier' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaShieldAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Supplier</span>
                </Dropdown.Item>
                <Dropdown.Item 
                  as={Link} 
                  to="/master-data/material" 
                  className={`rounded d-flex align-items-center px-3 py-2 ${
                    location.pathname === '/master-data/material' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaShieldAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Material</span>
                </Dropdown.Item>   
                <Dropdown.Item 
                  as={Link} 
                  to="/master-data/business-category" 
                  className={`rounded d-flex align-items-center px-3 py-2 ${
                    location.pathname === '/master-data/business-category' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaShieldAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Business Category</span>
                </Dropdown.Item>
                 <Dropdown.Item 
                  as={Link} 
                  to="/master-data/department" 
                  className={`rounded d-flex align-items-center px-3 py-2 ${
                    location.pathname === '/master-data/department' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaShieldAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Department</span>
                </Dropdown.Item>  
                <Dropdown.Item 
                  as={Link} 
                  to="/master-data/category" 
                  className={`rounded d-flex align-items-center px-3 py-2 ${
                    location.pathname === '/master-data/category' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaShieldAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Category</span>
                </Dropdown.Item>
                <Dropdown.Item 
                  as={Link} 
                  to="/master-data/sub-category" 
                  className={`rounded d-flex align-items-center px-3 py-2 ${
                    location.pathname === '/master-data/sub-category' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaShieldAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Sub-Category</span>
                </Dropdown.Item>            
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {/* 3. Product Data */}
        <Nav.Link as={Link} to="/product-data" className={`${getNavLinkClass('/product-data')} w-100`}>
          <BiPackage className="fs-4 flex-shrink-0" />
          {isExpanded && <span className="ms-3 fw-medium">Product Data</span>}
        </Nav.Link>

        {/* 4. Source Mapping */}
        <Nav.Link as={Link} to="/source-mapping" className={`${getNavLinkClass('/source-mapping')} w-100`}>
          <BiGitBranch className="fs-4 flex-shrink-0" />
          {isExpanded && <span className="ms-3 fw-medium">Source Mapping</span>}
        </Nav.Link>

        {/* 5. Customer Data */}
        <Nav.Link as={Link} to="/customer" className={`${getNavLinkClass('/customer')} w-100`}>
          <BiGroup className="fs-4 flex-shrink-0" />
          {isExpanded && <span className="ms-3 fw-medium">Customer</span>}
        </Nav.Link>

        {/* 6. User Management Row */}
        <div className="w-100 position-relative">
          {isExpanded ? (
            /* --- EXPANDED MODE: Renders standard inline accordion dropdown --- */
            <>
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={getNavLinkClass('/user-management/')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <FaUserShield className="fs-4 flex-shrink-0" />
                  <span className="ms-3 fw-medium">Identity & Access</span>
                </div>
                <BiChevronDown 
                  className="fs-5" 
                  style={{ 
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }} 
                />
              </div>

              <Collapse in={userMenuOpen}>
                <div>
                  <div className="d-flex flex-column ms-3 border-start ps-2 mt-1">
                    <Nav.Link as={Link} to="/user-management/users" className={getSubNavLinkClass('/user-management/users')}>
                      <FaUserAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Users</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/user-management/roles" className={getSubNavLinkClass('/user-management/roles')}>
                      <FaShieldAlt className="fs-5 flex-shrink-0 me-2" />
                      <span>Roles</span>
                    </Nav.Link>
                  </div>
                </div>
              </Collapse>
            </>
          ) : (
            /* --- COLLAPSED MODE: Renders a hoverable/clickable Popover Dropdown overlay --- */
            <Dropdown drop="end" className="w-100 d-flex justify-content-center">
              <Dropdown.Toggle 
                variant="transparent" 
                className={`p-0 border-0 d-flex align-items-center justify-content-center position-relative w-100 py-2 rounded  ${
                  userMenuOpen ? 'bg-primary text-white' : 'text-body'
                }`}
              >
                <FaUserShield className="fs-4 flex-shrink-0" />
                {/* Visual Indicator: Mini chevron overlay signifying that hidden options exist */}
              
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border py-2 px-1 m-0 ms-2 bg-body-tertiary">
                <div className="px-3 py-1 mb-1 border-bottom text-muted small fw-bold">
                  Identity & Access
                </div>
                <Dropdown.Item 
                  as={Link} 
                  to="/user-management/users" 
                  className={`rounded d-flex align-items-center px-3 py-2 my-1 ${
                    location.pathname === '/user-management/users' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaUserAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Users</span>
                </Dropdown.Item>
                <Dropdown.Item 
                  as={Link} 
                  to="/user-management/roles" 
                  className={`rounded d-flex align-items-center px-3 py-2 ${
                    location.pathname === '/user-management/roles' ? 'bg-primary text-white' : 'text-body'
                  }`}
                >
                  <FaShieldAlt className="fs-5 me-2 flex-shrink-0" />
                  <span>Roles</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

      </Nav>
    </div>
  );
};

export default Sidebar;