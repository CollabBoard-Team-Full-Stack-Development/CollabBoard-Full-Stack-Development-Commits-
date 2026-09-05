import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load from local storage if available on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('collabboard_token');
    const savedUser = localStorage.getItem('collabboard_user');
    
    if (savedUser && savedToken) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('collabboard_user');
        localStorage.removeItem('collabboard_token');
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  // Real backend login request
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Store token and user data for persistence & API interceptors
      localStorage.setItem('collabboard_token', token);
      localStorage.setItem('collabboard_user', JSON.stringify(user));
      localStorage.setItem('userInfo', JSON.stringify({ token })); // Required for api.js headers

      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      const errorMsg = err.response?.data?.error || 'Invalid email or password, or backend server is offline.';
      return { success: false, error: errorMsg };
    }
  };

  // Real backend registration request
  const register = async (name, email, password, role) => {
    try {
      const response = await API.post('/auth/register', { name, email, password, role });
      const { user, token } = response.data;

      setCurrentUser(user);
      setIsAuthenticated(true);

      localStorage.setItem('collabboard_token', token);
      localStorage.setItem('collabboard_user', JSON.stringify(user));
      localStorage.setItem('userInfo', JSON.stringify({ token }));

      return { success: true };
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMsg = err.response?.data?.error || 'Registration failed or backend server is offline.';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('collabboard_user');
    localStorage.removeItem('collabboard_token');
    localStorage.removeItem('userInfo');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, isAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      isAuthenticated: false,
      isAdmin: false,
      loading: false,
      login: async () => ({ success: false, error: 'Context not initialized' }),
      register: async () => ({ success: false, error: 'Context not initialized' }),
      logout: () => {}
    };
  }
  return context;
};