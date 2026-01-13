'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecipeFeed } from '@hooks/useRecipeFeed';
import { useApiClient } from '@hooks/useApiClient';
import { useToast } from '@context/ToastContext';

// Components
import { RecipeCard } from '@components/recipes/RecipeCard';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { LoadingState } from '@components/ui/LoadingState';
import { ErrorState } from '@components/ui/ErrorState';

export function RecipeFeed() {
  // Use our new custom hook for data logic
  const {
    recipes,
    status,
    errorMessage,
    showSlowLoadMessage,
    hasMore,
    isLoadingMore,
    fetchMoreRecipes,
    fetchInitialRecipes,
    removeRecipe
  } = useRecipeFeed();

  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, recipe: null });

  const api = useApiClient();
  const router = useRouter();
  const { showToast } = useToast();

  // Intersection Observer for Infinite Scroll
  const observer = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (status !== 'success' || !hasMore) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreRecipes();
      }
    });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.current.observe(currentSentinel);

    return () => {
      if (observer.current && currentSentinel) observer.current.unobserve(currentSentinel);
    };
  }, [status, hasMore, fetchMoreRecipes]);

  // Actions
  const handleEdit = (recipe) => router.push(`/edit-recipe/${recipe.id}`);
  const handleDelete = (recipe) => setDeleteModalState({ isOpen: true, recipe });

  const confirmDelete = async () => {
    if (!deleteModalState.recipe) return;
    try {
      await api.deleteRecipe(deleteModalState.recipe.id);
      showToast('Receta eliminada correctamente', 'success');
      removeRecipe(deleteModalState.recipe.id);
      setDeleteModalState({ isOpen: false, recipe: null });
    } catch (error) {
      showToast(error.message || 'Error al eliminar', 'error');
    }
  };

  // Render logic based on status
  if (status === 'loading') {
    return <LoadingState showSlowLoadMessage={showSlowLoadMessage} />;
  }

  if (status === 'error') {
    return <ErrorState message={errorMessage} onRetry={fetchInitialRecipes} />;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">Descubre Recetas</h1>
          <p className="text-lg text-gray-600 mt-1">
            Explora las mejores ideas para tu próxima comida.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border shadow-sm">
          <p className="text-muted-foreground text-lg mb-4">No hay recetas disponibles por el momento.</p>
          <Button
            className="mt-2"
            onClick={() => router.push('/create-recipe')}
          >
            Crear mi primera receta
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
      )}

      {/* Pagination Sentinel */}
      <div ref={sentinelRef} aria-hidden="true" className="h-4 w-full" />

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {/* End of Feed Message */}
      {!hasMore && recipes.length > 0 && (
        <div className="text-center py-12 border-t mt-12 border-gray-100">
          <p className="text-gray-400 text-sm">Has llegado al final de la lista.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalState.isOpen}
        onClose={() => setDeleteModalState({ isOpen: false, recipe: null })}
        title="Eliminar Receta"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            ¿Estás seguro de que deseas eliminar <strong>{deleteModalState.recipe?.name}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteModalState({ isOpen: false, recipe: null })}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              Sí, eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
