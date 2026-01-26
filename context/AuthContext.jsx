'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService } from '@/lib/services/auth';
import { CacheManager } from '@utils/cacheManager';

// Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserSession = useCallback(async () => {
    try {
      const res = await fetch('/api/me');

      // 1. Explicitly handle 401 (Token Expired / Invalid)
      if (res.status === 401) {
        console.warn("Session expired (401). Clearing local session.");
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('culina_user_session');
          // Optional: clear other caches if needed, but session is critical
        }
        return; // STOP here. Do not throw, do not go to catch.
      }

      // 2. Handle other errors (500, etc) -> throw to trigger offline logic
      if (!res.ok) {
        throw new Error('No autenticado o Error de Servidor');
      }

      // 3. Success (200 OK)
      const { user } = await res.json();
      setUser(user);

      // SECURITY: Only store safe fields offline. No tokens, no passwords.
      const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_photo: user.profile_photo_url || user.profile_photo
      };
      localStorage.setItem('culina_user_session', JSON.stringify(safeUser));

    } catch (error) {
      console.warn("Session check failed (Network/Server):", error);
      
      // Offline Persistence: Only try to restore if it was NOT a 401 (which returns early)
      // If we are here, it's likely a network error or 500.
      if (typeof window !== 'undefined') {
        const cachedUser = localStorage.getItem('culina_user_session');
        if (cachedUser) {
          console.log("Restoring user session from cache (Offline Mode)");
          setUser(JSON.parse(cachedUser));
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  const login = useCallback(async (email, password) => {
    // We use the Next.js API route for Login to handle efficient Cookie setting
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
    const safeUser = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      profile_photo: data.user.profile_photo_url || data.user.profile_photo
    };
    localStorage.setItem('culina_user_session', JSON.stringify(safeUser));
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    // Call our internal Next.js API route which proxies to the backend
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw {
        message: data.message || 'Error en el registro',
        status: res.status
      };
    }

    return data;
  }, []);


  // ...

  const logout = useCallback(async (options = {}) => {
    const { returnUrl } = options;
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (error) {
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('culina_user_session');
        // PRIVACY: Clear ALL recipe caches ONLY if explicit logout (no returnUrl)
        // If auto-logout (returnUrl exists), we preserve cache to restore feed state.
        if (!returnUrl) {
          CacheManager.clearAll();
        }
      }

      const loginUrl = returnUrl
        ? `/login?callbackUrl=${encodeURIComponent(returnUrl)}`
        : '/login';

      window.location.assign(loginUrl);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);