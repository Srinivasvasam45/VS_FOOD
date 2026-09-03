import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data.user);
            setPartner(res.data.partner || null);
          }
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setPartner(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setPartner(res.data.partner || null);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Invalid credentials or server error';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setPartner(res.data.partner || null);
        return { success: true, user: res.data.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setPartner(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const updatePartner = (updatedPartner) => {
    setPartner((prev) => ({ ...prev, ...updatedPartner }));
  };

  const isFoodPartner = user?.role === 'foodPartner';

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        token,
        isAuthenticated: !!token && !!user,
        isFoodPartner,
        loading,
        login,
        register,
        logout,
        updateUser,
        updatePartner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
