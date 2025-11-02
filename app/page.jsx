import { RecipeFeed } from '@components/recipes/RecipeFeed';
import { createApiClient } from '../lib/apiClient'; // Usamos la ruta relativa correcta

/**
 * Esta función se ejecuta en el servidor.
 * No puede usar hooks como `useApiClient`.
 */
async function getRecipes() {
  try {
    // Creamos una instancia del cliente de API para usar en el servidor.
    const api = createApiClient(); 
    const data = await api.getRecipes();
    return data?.data || data || [];
  } catch (error) {
    console.error("Error fetching recipes on server:", error);
    // En caso de error, devolvemos un array vacío para que la página no se rompa.
    return [];
  }
}

// La página ahora es un Componente de Servidor (async y sin 'use client')
export default async function HomePage() {
  // 1. Obtenemos las recetas en el servidor ANTES de renderizar.
  const initialRecipes = await getRecipes();

  // 2. Pasamos las recetas al componente de cliente que se encargará de la UI.
  return (
    <RecipeFeed initialRecipes={initialRecipes} />
  );
}