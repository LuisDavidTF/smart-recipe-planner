'use client' 

import { use } from 'react';
import { RecipeForm } from '@components/recipes/RecipeForm'; 

export default function EditRecipePage({ params }) {
  const { id } = use(params);

  return <RecipeForm recipeId={id} />;
}