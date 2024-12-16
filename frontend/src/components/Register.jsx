import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { config } from "../App";

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.endpoint}/auth/signup`, formData);
      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      alert('Error during registration.');
    }
  };

  return (
    <Box sx={{ width: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} mt={2}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button variant="contained" onClick={handleSubmit} type="submit" fullWidth sx={{ mt: 2 }}>
          Register
        </Button>
        <Box sx={{ mt: 2 }}>
        <Typography variant="body2" align="center">
            Already registered{' '}
          <Link href="/login" variant="body2" sx={{ cursor: 'pointer' }}>
              Login
            </Link>
          </Typography>
          </Box>
      </Box>
    </Box>
  );
};

export default Register;
