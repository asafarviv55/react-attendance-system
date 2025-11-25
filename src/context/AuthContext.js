import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    userName: localStorage.getItem('userName') || null,
    role: localStorage.getItem('role') || null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    if (token && userId && userName && role) {
      setAuth({ token, userId, userName, role });
    }
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/signin', { email, password });
      const { token, userId, userName, roleName } = response.data;
      setAuth({ token, userId, userName, role: roleName });
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('role', roleName);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Sign in failed. Please check your credentials.';
      return { success: false, message };
    }
  };

  const signOut = () => {
    setAuth({ token: null, userId: null, userName: null, role: null });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
  };

  const signUp = async (email, password, roleName = 'employee') => {
    try {
      const response = await api.post('/auth/signup', { email, password, roleName });
      const { token, userId, userName } = response.data;
      setAuth({ token, userId, userName, role: roleName });
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('role', roleName);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Sign up failed. Please try again.';
      return { success: false, message };
    }
  };

  const isAuthenticated = () => {
    return !!auth.token;
  };

  const hasRole = (roles) => {
    return roles.includes(auth.role);
  };

  return (
    <AuthContext.Provider value={{ auth, loading, signIn, signOut, signUp, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
