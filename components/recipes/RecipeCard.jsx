
'use client'

import React from 'react';
import Link from 'next/link'; 
import { useAuth } from '@context/AuthContext'; 
import { ClockIcon, EyeIcon, EditIcon, TrashIcon } from '@components/ui/Icons'; 

export function RecipeCard({ recipe, viewHref, onEdit, onDelete }) {
  const { user } = useAuth();
  const isOwner = user && user.id === recipe.user_id;

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Receta';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <img
        src={recipe.image_url || 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Receta'}
        alt={recipe.name}
        onError={handleImageError}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-5 flex flex-col grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 grow">
          {recipe.description}
        </p>
        <div className="flex items-center text-gray-500 text-sm mt-auto">
          <ClockIcon className="w-4 h-4 mr-2" />
          <span>{recipe.preparation_time_minutes || 'N/A'} min</span>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex gap-2">
        
        <Link 
          href={viewHref}
          scroll={false} 
          className="flex-1 text-sm inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-xs text-gray-700 hover:bg-gray-100"
        >
          <EyeIcon className="w-4 h-4 mr-2" /> Ver
        </Link>
        
        {isOwner && (
          <>
            <button 
              onClick={() => onEdit(recipe)}
              className="flex-1 text-sm inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-xs text-blue-600 hover:bg-blue-50"
            >
              <EditIcon className="w-4 h-4 mr-2" /> Editar
            </button>
            <button 
              onClick={() => onDelete(recipe)}
              className="flex-1 text-sm inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-xs text-red-600 hover:bg-red-50"
            >
              <TrashIcon className="w-4 h-4 mr-2" /> Elim.
            </button>
          </>
        )}
      </div>
    </div>
  );
}