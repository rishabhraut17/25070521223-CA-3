import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('flexi_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user with token on first load
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('flexi_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.token) {
      localStorage.setItem('flexi_token', response.token);
      setToken(response.token);
      setUser(response.user);
      return response;
    }
    throw new Error(response.message || 'Login failed');
  };

  const register = async (name, email, password, confirmPassword) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword
    });
    if (response.success && response.token) {
      localStorage.setItem('flexi_token', response.token);
      setToken(response.token);
      setUser(response.user);
      return response;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('flexi_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err.message);
    }
  };

  const updateProfile = async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    if (response.success && response.user) {
      setUser(response.user);
      return response;
    }
    throw new Error(response.message || 'Failed to update profile');
  };

  const updatePassword = async (passwordData) => {
    const response = await api.put('/users/password', passwordData);
    return response;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    updatePassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
