// src/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Add this

  // Initialize axios with base URL
  const api = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests if it exists
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (email, password) => {
    setError('');
    try {
      const response = await api.post('/auth/register', { email, password });
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Verify OTP
  const verifyOtp = async (userId, otp) => {
    setError('');
    try {
      const response = await api.post('/auth/verify-otp', { userId, otp });
      // After successful OTP verification, navigate to dashboard
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        setUser(payload);
        navigate('/dashboard'); // Add this
      }
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'OTP verification failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Login - UPDATED WITH NAVIGATION
  const login = async (email, password) => {
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        setUser(payload);
        navigate('/dashboard'); // ADD THIS LINE - redirect to dashboard after login
      }
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Resend OTP
  const resendOtp = async (email) => {
    setError('');
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to resend OTP';
      setError(message);
      return { success: false, message };
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setError('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send reset email';
      setError(message);
      return { success: false, message };
    }
  };

  // Reset password
  const resetPassword = async (email, otp, newPassword) => {
    setError('');
    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      // After password reset, navigate to login or dashboard
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const payload = JSON.parse(atob(response.data.token.split('.')[1]));
        setUser(payload);
        navigate('/dashboard'); 
      }
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to reset password';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); 
  };

  const value = {
    user,
    loading,
    error,
    register,
    verifyOtp,
    login,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};