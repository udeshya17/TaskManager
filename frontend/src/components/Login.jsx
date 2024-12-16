import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { config } from '../App';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before attempting login

    try {
      const response = await axios.post(`${config.endpoint}/auth/login`, formData);
      alert('Login successful!');

      // Save token and user data to localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.userId);

      // Notify parent component of successful login
      onLoginSuccess();

      // Redirect to the dashboard
      navigate('/dashboard');
    } catch (error) {
      // Display appropriate error messages
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Box sx={{ width: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom align="center">
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Login
        </Button>
      </Box>

      {/* Link to Register page */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" align="center">
          Don't have an account?{' '}
          <Link href="/register" variant="body2" sx={{ cursor: 'pointer', textDecoration: 'none' }}>
            Register Now
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
