import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

export const Nav = ({ isAuthenticated, onLogout }) => {
  const [open, setOpen] = useState(false); // State to manage drawer visibility
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
    setOpen(false); // Close the drawer on logout
  };

  const handleLinkClick = () => {
    setOpen(false); // Close the drawer when a link is clicked
  };

  const toggleDrawer = (openState) => {
    setOpen(openState);
  };

  const drawerLinks = (
    <List>
      {isAuthenticated ? (
        <>
          <ListItem button component={Link} to="/dashboard" onClick={handleLinkClick}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/taskmanager" onClick={handleLinkClick}>
            <ListItemText primary="Task Manager" />
          </ListItem>
          <ListItem button onClick={handleLogoutClick}>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      ) : (
        <>
          <ListItem button component={Link} to="/login" onClick={handleLinkClick}>
            <ListItemText primary="Login" />
          </ListItem>
          <ListItem button component={Link} to="/register" onClick={handleLinkClick}>
            <ListItemText primary="Register" />
          </ListItem>
        </>
      )}
    </List>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Task Management
        </Typography>

        {/* Hamburger Menu for small screens */}
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={() => toggleDrawer(true)}
          sx={{ display: { xs: 'block', sm: 'none' } }} // Show only on small screens
        >
          <MenuIcon />
        </IconButton>

        {/* Navigation Links for larger screens */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexGrow: 1,
            justifyContent: 'center', // Center Dashboard and Task Manager
            display: { xs: 'none', sm: 'flex' }, // Hide on small screens
          }}
        >
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} to="/taskmanager">
                Task Manager
              </Button>
            </>
          ) : null}
        </div>

        {/* Logout Button on the right end for larger screens */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end', // Align Logout to the right
            flexGrow: 1,
            display: { xs: 'none', sm: 'flex' }, // Hide on small screens
          }}
        >
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogoutClick}>
              Logout
            </Button>
          )}
        </div>

        {/* Drawer for mobile view */}
        <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
          {drawerLinks}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
