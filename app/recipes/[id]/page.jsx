// app/recipes/[id]/page.jsx

import React ,{ use } from 'react';
// ¡Importante! Importamos la constante de tu API
// Ajusta la ruta si no usas alias (@/): ../../../utils/constants
import { API_BASE_URL } from '@utils/constants'; 
 
// (Tus otros imports de componentes si los necesitas)
// import { Button } from '@components/ui/Button'; 
// import { EditIcon, TrashIcon } from '@components/ui/Icons';

// Función para cargar datos en el SERVIDOR
async function getRecipeData(id) {
  // ¡Usamos la constante importada!
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, { 
    cache: 'no-store' 
  });

  if (!res.ok) throw new Error('No se pudo cargar la receta');
  const data = await res.json();
  return data?.data || data; // Ajusta según la respuesta de tu API
}

// Contenido de la receta (JSX)
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

// ¡Solución 1: Añadimos 'async'!
export default function RecipePage({ params }) {
  
  // 3. Usa 'use(params)' para desenvolver el id
  const { id } = use(params); // <-- Esta es la nueva línea 42

  // 4. Usa 'use()' para desenvolver la promesa de datos
  //    'getRecipeData(id)' devuelve una promesa. 'use()' la espera.
  const recipe = use(getRecipeData(id));

  // 5. Ya no necesitamos 'try/catch' aquí.
  //    'use()' manejará la promesa. Si falla, Next.js
  //    automáticamente mostrará tu archivo 'error.js' más cercano.
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
      <RecipeDetailContent recipe={recipe} />
    </div>
  );
}