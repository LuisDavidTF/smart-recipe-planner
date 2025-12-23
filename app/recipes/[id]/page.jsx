

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
  // Fail-safe: si por alguna razón el objeto recipe llega null/undefined,
  // evitamos que la UI explote (White Screen of Death).
  if (!recipe) return null;

  return (
    <>
      {/* Image handling: Fallback robusto. 
        Evitamos layout shifts o iconos de imagen rota si la URL viene vacía del backend.
      */}
      <img 
        src={recipe.image_url || 'https://placehold.co/600x400'} 
        alt={recipe.name} 
        className="w-full h-64 object-cover rounded-lg mb-4" 
      />
      
      <p className="text-gray-700 mb-4">{recipe.description}</p>
      
      <div className="flex gap-4 mb-4 text-sm text-gray-600">
        <p><strong>Tiempo:</strong> {recipe.preparation_time_minutes} min</p>
        <p><strong>Por:</strong> {recipe.user?.name || 'Anónimo'}</p>
      </div>

      {/* --- INGREDIENTES --- */}
      <h4 className="font-semibold mt-4 mb-2">Ingredientes:</h4>
      <ul className="list-disc list-inside mb-4 pl-2">
        {/* Validación de length: Es más seguro chequear > 0 que confiar solo en la existencia del array.
          Mejora la UX mostrando un mensaje explícito si la lista está vacía.
        */}
        {recipe.ingredients?.length > 0 ? (
          recipe.ingredients.map((ing, i) => (
            <li key={ing.id || i} className="mb-1">
              <span className="font-medium">{ing.quantity} {ing.unit_of_measure}</span> de {ing.ingredient.name}
            </li>
          ))
        ) : (
          <li className="text-gray-500 italic list-none">No hay ingredientes listados.</li>
        )}
      </ul>

      {/* --- INSTRUCCIONES (MIGRADO A ARRAY) --- */}
      <h4 className="font-semibold mt-4 mb-2">Instrucciones:</h4>
      <div className="space-y-3">
        {/* REFACTOR: Adaptado para List<String> (Array).
          1. Iteramos directamente los strings.
          2. Generamos el "Paso X" dinámicamente con (index + 1). 
             Esto desacopla la presentación de la persistencia: el orden visual siempre es secuencial.
        */}
        {recipe.instructions?.length > 0 ? (
          recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-3 items-start">
              {/* 'whitespace-nowrap' asegura que "Paso 10:" no se rompa en dos líneas */}
              <strong className="whitespace-nowrap min-w-[4rem] text-gray-900">
                Paso {index + 1}:
              </strong>
              <p className="text-gray-700 leading-relaxed">
                {instruction}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No hay instrucciones detalladas para esta receta.</p>
        )}
      </div>
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
