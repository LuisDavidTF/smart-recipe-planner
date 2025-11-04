'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  const checkUserSession = useCallback(async () => {
    try {
      const res = await fetch('/api/me'); 
      if (!res.ok) {
        throw new Error('No autenticado');
      }
      const { user } = await res.json();
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]); 

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }
    
    setUser(data.user);
    return data.user;
  }, []); 

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    const res = await fetch(`${API_BASE_URL}/users/register`, { 
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirmation }),
    });
    
    const data = await res.json();
    if (!res.ok) {
      const errorMsg = data.message || data.error || 'Error al registrar';
      throw new Error(errorMsg);
    }
    return data;
  }, []); 

  const logout = useCallback(async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
    } finally {
      setUser(null); 
      window.location.assign('/login');
    }
  }, []); 

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);