'use client'
import { useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
// ¡ELIMINADO! Ya no necesitamos API_BASE_URL en el cliente.
// import { API_BASE_URL } from '../utils/constants';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useApiClient = () => {
  // 1. ¡CAMBIO! Solo necesitamos 'logout' de useAuth, no 'token'.
  const { logout } = useAuth();

  const request = useCallback(async (endpoint, options = {}) => {
    const { body, ...customConfig } = options;
    
    // 2. ¡CAMBIO! Ya no creamos el header 'Authorization'.
    // La cookie httpOnly se adjunta automáticamente.
    const headers = { 'Content-Type': 'application/json' };

    const config = {
      method: body ? 'POST' : 'GET',
      ...customConfig,
      headers: {
        ...headers,
        ...customConfig.headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    let retries = 3;
    let delay = 2000;

    for (let i = 0; i <= retries; i++) {
      try {
        // 3. ¡CAMBIO! La URL ya no usa API_BASE_URL.
        // El 'endpoint' que pasamos (ej: '/api/recipes') es la URL completa.
        const response = await fetch(endpoint, config);
        
        if (response.status === 204) {
          return null; 
        }

        const data = await response.json();

        // 4. Esta lógica de 401 sigue siendo PERFECTA.
        // Si nuestro /api/me o /api/recipes falla, cerramos sesión.
        if (response.status === 401) {
          logout();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        }
        
        if (!response.ok) {
          // ... (Toda tu lógica de manejo de errores se queda igual)
          let errorMessage = 'Error en la solicitud a la API'; 
          if (data.errors && Array.isArray(data.errors) && data.errors[0]?.message) {
              errorMessage = data.errors[0].message;
          } // ... etc
          throw new Error(errorMessage);
        }

        return data;

      } catch (error) {
        // ... (Toda tu lógica de reintentos de red se queda igual)
        console.error(`Error en el cliente API (Intento ${i + 1}/${retries + 1}):`, error);
        const isNetworkError = error.message === 'Failed to fetch' || error.name === 'SyntaxError';
        
        if (isNetworkError) {
          if (i === retries) {
            throw new Error('Error de Red/CORS. No se pudo conectar a la API.');
          }
          await sleep(delay);
          delay *= 2;
        } else {
          throw error; 
        }
      }
    }
  }, [logout]); // 5. ¡CAMBIO! 'token' ya no es una dependencia.

  // 6. ¡CAMBIO! Todas las rutas ahora apuntan a tu proxy /api/...
  return useMemo(() => ({
    // GET /api/recipes
    getRecipes: () => request('/api/recipes'),
    
    // GET /api/recipes/[id]
    getRecipeById: (id) => request(`/api/recipes/${id}`),
    
    // POST /api/recipes
    createRecipe: (recipeData) => request('/api/recipes', { body: recipeData, method: 'POST' }),
    
    // PATCH /api/recipes/[id]
    updateRecipe: (id, recipeData) => request(`/api/recipes/${id}`, { body: recipeData, method: 'PATCH' }),
    
    // DELETE /api/recipes/[id]
    deleteRecipe: (id) => request(`/api/recipes/${id}`, { method: 'DELETE' }),
    
  }), [request]);
};