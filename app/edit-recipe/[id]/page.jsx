// app/edit-recipe/[id]/page.jsx
'use client' // Necesario para usar 'use' y renderizar el formulario

import { use } from 'react';
// Ajusta la ruta a donde guardaste tu RecipeForm refactorizado
import { RecipeForm } from '@components/recipes/RecipeForm'; 

export default function EditRecipePage({ params }) {
  // Usamos use(params) para desenvolver la promesa 
  // y obtener el 'id' de forma segura
  const { id } = use(params);

  // Renderiza el formulario pasándole el 'id'
  return <RecipeForm recipeId={id} />;
}