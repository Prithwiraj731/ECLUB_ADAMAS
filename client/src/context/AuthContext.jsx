import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem('adminToken');
      const storedAdmin = sessionStorage.getItem('adminUser');
      if (storedToken && storedAdmin) {
        setToken(storedToken);
        setAdmin(JSON.parse(storedAdmin));
      }
    } catch (e) {
      console.error('Failed to load stored auth session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success && data.token) {
        setToken(data.token);
        setAdmin(data.admin);
        sessionStorage.setItem('adminToken', data.token);
        sessionStorage.setItem('adminUser', JSON.stringify(data.admin));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: Boolean(token), login, logout, loading }}>
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
