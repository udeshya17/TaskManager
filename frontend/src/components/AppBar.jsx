import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';

export const NavBar = ({ isAuthenticated, onLogout }) => {
  const [show, setShow] = useState(false); // State to manage navbar collapse visibility
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
    setShow(false); // Collapse the navbar on logout
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Task Management
        </Navbar.Brand>

        {/* Toggle button for small screens */}
        <Navbar.Toggle aria-controls="navbar-nav" onClick={() => setShow(!show)} />

        {/* Navbar links for larger and smaller screens */}
        <Navbar.Collapse id="navbar-nav" in={show}>
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/taskmanager">
                  Task Manager
                </Nav.Link>
                <Nav.Link onClick={handleLogoutClick}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
