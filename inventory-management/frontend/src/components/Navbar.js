import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <BootstrapNavbar expand="lg" className="bg-white shadow-sm py-3">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaBox className="text-primary fs-4" />
          <span className="ms-2 fw-bold">Inventory Management</span>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/profile" className="d-flex align-items-center px-3 py-2 rounded-3 hover-bg-light">
                  <FaUser className="me-2" />
                  <span className="fw-medium">Profile</span>
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  className="ms-2 px-3 py-2 rounded-3 d-flex align-items-center"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" />
                  <span className="fw-medium">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="px-3 py-2 rounded-3 hover-bg-light">
                  <span className="fw-medium">Login</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="px-3 py-2 rounded-3 hover-bg-light">
                  <span className="fw-medium">Register</span>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar; 