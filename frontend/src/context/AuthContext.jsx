import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadUserFromToken = useCallback(async () => {
    const token = api.getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        console.log('Token expirado');
        api.setAuthToken(null);
        setIsLoading(false);
        return;
      }

      const userId = decoded.id || decoded.idUsuario || decoded.sub;
      console.log('Carregando usuário com ID:', userId);
      
      const userData = await api.getUser(userId);
      console.log('Usuário carregado:', userData);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to load user:', error);
      api.setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email, senha) => {
    const response = await api.login(email, senha);
    if (response.token) {
      const decoded = jwtDecode(response.token);
      const userId = decoded.id || decoded.idUsuario || decoded.sub;
      const userData = await api.getUser(userId);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    }
    throw new Error('Login failed');
  };

  const register = async (userData) => {
    await api.register(userData);
    return login(userData.email, userData.senha);
  };

  const logout = () => {
    api.setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (userData) => {
    if (!user) return;
    const updatedUser = await api.updateUser(user.idUsuario, userData);
    setUser(updatedUser);
    return updatedUser;
  };

  const refreshUser = () => {
    loadUserFromToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
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

export default AuthContext;