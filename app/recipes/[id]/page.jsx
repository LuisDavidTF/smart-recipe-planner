

import React ,{ use } from 'react';
import { API_BASE_URL } from '@utils/constants'; 
 
async function getRecipeData(id) {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, { 
    cache: 'no-store' 
  });

  if (!res.ok) throw new Error('No se pudo cargar la receta');
  const data = await res.json();
  return data?.data || data; 
}


function RecipeDetailContent({ recipe }) {
  return (
    <>
      <img src={recipe.image_url || 'https://placehold.co/600x400'} alt={recipe.name} className="w-full h-64 object-cover rounded-lg mb-4" />
      <p className="text-gray-700 mb-4">{recipe.description}</p>
      <p><strong>Tiempo:</strong> {recipe.preparation_time_minutes} min</p>
      <p><strong>Por:</strong> {recipe.user?.name || 'Anónimo'}</p>
      <h4 className="font-semibold mt-4 mb-2">Ingredientes:</h4>
      <ul>{recipe.ingredients?.map((ing, i) => <li key={ing.id || i}>{ing.quantity} {ing.unit_of_measure} de {ing.ingredient.name}</li>) || <li>No listados</li>}</ul>
      <h4 className="font-semibold mt-4 mb-2">Instrucciones:</h4>
      <div>{recipe.instructions && Object.entries(recipe.instructions).map(([step, text]) => <p key={step}><strong>{step}:</strong> {text}</p>)}</div>
    </>
  );
}

export default function RecipePage({ params }) {
  
  const { id } = use(params); 

  const recipe = use(getRecipeData(id));

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
      <RecipeDetailContent recipe={recipe} />
    </div>
  );
}