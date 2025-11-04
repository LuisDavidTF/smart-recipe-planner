'use client'
import { useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const useApiClient = () => {
  const { logout } = useAuth();

  const request = useCallback(async (endpoint, options = {}) => {
    const { body, ...customConfig } = options;

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
        const response = await fetch(endpoint, config);
        
        if (response.status === 204) {
          return null; 
        }

        const data = await response.json();

        if (response.status === 401) {
          logout();
          throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        }
        
        if (!response.ok) {
          let errorMessage = 'Error en la solicitud a la API'; 
          if (data.errors && Array.isArray(data.errors) && data.errors[0]?.message) {
              errorMessage = data.errors[0].message;
          } 
          throw new Error(errorMessage);
        }

        return data;

      } catch (error) {
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
  }, [logout]);

  return useMemo(() => ({
    getRecipes: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const queryString = query ? `?${query}` : '';
      return request(`/api/recipes${queryString}`);
    },
    
    getRecipeById: (id) => request(`/api/recipes/${id}`),
    
    createRecipe: (recipeData) => request('/api/recipes', { body: recipeData, method: 'POST' }),
    
    updateRecipe: (id, recipeData) => request(`/api/recipes/${id}`, { body: recipeData, method: 'PATCH' }),
    
    deleteRecipe: (id) => request(`/api/recipes/${id}`, { method: 'DELETE' }),
    
  }), [request]);
};