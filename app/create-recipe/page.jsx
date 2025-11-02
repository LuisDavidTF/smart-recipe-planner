// app/create-recipe/page.jsx
'use client' // Necesario porque renderiza un Client Component

// Ajusta la ruta a donde guardaste tu RecipeForm refactorizado
import { RecipeForm } from '@components/recipes/RecipeForm'; 

export default function CreateRecipePage() {
  // Simplemente renderiza el formulario.
  // No pasamos 'recipeId', por lo que 'isEditMode' será 'false'
  return <RecipeForm />;
}