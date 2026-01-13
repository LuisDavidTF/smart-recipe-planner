

import React, { use } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@utils/constants';
import { ClockIcon, UserIcon } from '@components/ui/Icons';

async function getRecipeData(id) {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('No se pudo cargar la receta');
  const data = await res.json();
  return data?.data || data;
}

function RecipeDetailContent({ recipe }) {
  if (!recipe) return null;

  const imageUrl = recipe.image_url || 'https://placehold.co/600x400/059669/ffffff?text=Receta';

  return (
    <article className="bg-white rounded-xl shadow-xs overflow-hidden border border-gray-100">

      {/* Hero Header with Image */}
      <div className="relative w-full h-72 sm:h-96 bg-gray-100">
        <Image
          src={imageUrl}
          alt={recipe.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized={!imageUrl.includes('placehold.co')}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6 md:p-8 text-white w-full">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 shadow-sm">{recipe.name}</h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                <ClockIcon className="w-4 h-4 mr-2" />
                {recipe.preparation_time_minutes} min
              </span>
              <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                <UserIcon className="w-4 h-4 mr-2" />
                {recipe.user?.name || 'Chef SmartRecipe'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid gap-8 md:grid-cols-[2fr_1fr]">

        {/* Main Content */}
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              Descripción
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {recipe.description}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              Instrucciones
            </h2>
            <div className="space-y-6">
              {recipe.instructions?.length > 0 ? (
                recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4 group">
                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 leading-7 mt-1">
                      {instruction}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No hay instrucciones detalladas para esta receta.</p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar / Ingredients */}
        <aside>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
              Ingredientes
            </h3>
            <ul className="space-y-3">
              {recipe.ingredients?.length > 0 ? (
                recipe.ingredients.map((ing, i) => (
                  <li key={ing.id || i} className="flex items-start justify-between text-sm">
                    <span className="text-gray-700 font-medium">{ing.ingredient.name}</span>
                    <span className="text-gray-500 whitespace-nowrap ml-2">
                      {ing.quantity} {ing.unit_of_measure}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic text-sm">No hay ingredientes listados.</li>
              )}
            </ul>
          </div>
        </aside>

      </div>
    </article>
  );
}

export default function RecipePage({ params }) {
  const { id } = use(params);
  const recipe = use(getRecipeData(id));

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <RecipeDetailContent recipe={recipe} />
    </div>
  );
}
