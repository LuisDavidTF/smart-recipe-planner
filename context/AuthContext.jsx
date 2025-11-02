'use client'

// 1. Quita 'usePathname' de los imports
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '@utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 
  // 2. Quita la inicialización de usePathname
  // const pathname = usePathname(); 

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
  }, []); // Dependencia vacía = 100% estable

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
  }, []); // Dependencia vacía = 100% estable

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    // Llama al backend directo (como lo tenías)
    const res = await fetch(`${API_BASE_URL}/users/register`, { // Asumo que esta es la ruta
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
  }, []); // Dependencia vacía = 100% estable

  // 3. ¡CORRECCIÓN CLAVE!
  // Quitamos 'pathname' de las dependencias
  const logout = useCallback(async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    } finally {
      setUser(null); 
      // Forzamos una recarga completa a la página de login.
      // Esto limpia todo el estado de React de forma segura.
      window.location.assign('/login');
    }
  }, []); // ¡Dependencia vacía = 100% estable!

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, register, logout }}>
      {/* Esto renderiza los hijos (tu app) inmediatamente */}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);