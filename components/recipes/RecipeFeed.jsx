'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from '@hooks/useApiClient';
import { useToast } from '@context/ToastContext';
import { RecipeCard } from '@components/recipes/RecipeCard';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';

export function RecipeFeed({ initialRecipes }) {
  // El estado ahora se inicializa con los datos del servidor
  const [recipes, setRecipes] = useState(initialRecipes);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, recipe: null });

  const api = useApiClient();
  const router = useRouter();
  const { showToast } = useToast();

  // Sincronizamos el estado si las props cambian (por ejemplo, tras un router.refresh)
  useEffect(() => {
    setRecipes(initialRecipes);
  }, [initialRecipes]);

  const handleEdit = (recipe) => router.push(`/edit-recipe/${recipe.id}`);
  
  const handleDelete = (recipe) => setDeleteModalState({ isOpen: true, recipe: recipe });
  
  const confirmDelete = async () => {
    if (!deleteModalState.recipe) return;
    try {
      await api.deleteRecipe(deleteModalState.recipe.id);
      showToast('Receta eliminada exitosamente', 'success');
      
      // En lugar de volver a hacer fetch, simplemente actualizamos el estado local
      setRecipes(currentRecipes => currentRecipes.filter(r => r.id !== deleteModalState.recipe.id));
      
      setDeleteModalState({ isOpen: false, recipe: null });
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const renderContent = () => {
    if (!recipes || recipes.length === 0) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-800">No hay recetas todavía</h3>
          <p className="text-gray-500 mt-2">¿Por qué no creas la primera?</p>
          <Button onClick={() => router.push('/create-recipe')} className="mt-4">
            Crear Receta
          </Button>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            viewHref={`/recipes/${recipe.id}`} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">Descubre Recetas</h1>
        <p className="text-lg text-gray-600 mt-1">Inspiración diaria para tus comidas.</p>
      </div>
      <div className="transition-opacity duration-300">
        {renderContent()}
      </div>
      
      <Modal 
        isOpen={deleteModalState.isOpen} 
        onClose={() => setDeleteModalState({ isOpen: false, recipe: null })} 
        title="Confirmar Eliminación"
      >
        <p>¿Estás seguro de que quieres eliminar la receta "<strong>{deleteModalState.recipe?.name}</strong>"?</p>
        <div className="flex gap-4 mt-6">
          <Button variant="secondary" onClick={() => setDeleteModalState({ isOpen: false, recipe: null })} className="w-full">Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete} className="w-full">Sí, eliminar</Button>
        </div>
      </Modal>
    </div>
  );
}