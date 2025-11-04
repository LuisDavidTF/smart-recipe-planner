'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from '@hooks/useApiClient';
import { useToast } from '@context/ToastContext';
import { RecipeCard } from '@components/recipes/RecipeCard';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { LoadingState } from '@components/ui/LoadingState'; // Import LoadingState

export function RecipeFeed({ initialRecipes, initialNextCursor }) { // Accept initial props again
  const [recipes, setRecipes] = useState(initialRecipes);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(initialRecipes.length === 0 && !!initialNextCursor); // Only truly loading if initial is empty and there's more
  const [hasMore, setHasMore] = useState(!!initialNextCursor);
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, recipe: null });
  const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false); // State for slow load message

  const api = useApiClient();
  const router = useRouter();
  const { showToast } = useToast();
  const observer = useRef(null);
  const sentinelRef = useRef(null);

  const stateRef = useRef({ isLoading, hasMore, nextCursor });
  stateRef.current = { isLoading, hasMore, nextCursor };

  const fetchMoreRecipes = useCallback(async () => {
    if (stateRef.current.isLoading || !stateRef.current.hasMore) return;
    setIsLoading(true);
    try {
      const params = {
        limit: 6,
      };
      // Only add cursor params if nextCursor exists
      if (stateRef.current.nextCursor) {
        params.cursorId = stateRef.current.nextCursor.id;
        params.cursorDate = stateRef.current.nextCursor.createdAt;
      }

      const { data: newRecipes, nextCursor: newNextCursor } = await api.getRecipes(params);
      
      setRecipes(prevRecipes => {
        const newRecipeIds = new Set(prevRecipes.map(r => r.id));
        const uniqueNewRecipes = newRecipes.filter(r => !newRecipeIds.has(r.id));
        return [...prevRecipes, ...uniqueNewRecipes];
      });

      setNextCursor(newNextCursor);
      setHasMore(!!newNextCursor && newRecipes.length > 0);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [api, showToast]);

  // Effect to trigger initial client-side fetch if server provided no recipes but there are more available
  useEffect(() => {
    if (initialRecipes.length === 0 && !!initialNextCursor && recipes.length === 0) {
      fetchMoreRecipes();
    }
  }, [initialRecipes, initialNextCursor, recipes.length, fetchMoreRecipes]);


  // Effect for IntersectionObserver
  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreRecipes();
      }
    });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.current.observe(currentSentinel);
    }

    return () => {
      if (observer.current && currentSentinel) {
        observer.current.unobserve(currentSentinel);
      }
    };
  }, [fetchMoreRecipes]);

  // Effect to show slow load message after a delay
  useEffect(() => {
    let timer;
    // Show slow load message only if recipes are empty and currently loading (initial client-side fetch)
    if (isLoading && recipes.length === 0) {
      timer = setTimeout(() => {
        setShowSlowLoadMessage(true);
      }, 3000); // Show message after 3 seconds
    } else {
      setShowSlowLoadMessage(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading, recipes.length]);

  const handleEdit = (recipe) => router.push(`/edit-recipe/${recipe.id}`);
  
  const handleDelete = (recipe) => setDeleteModalState({ isOpen: true, recipe: recipe });
  
  const confirmDelete = async () => {
    if (!deleteModalState.recipe) return;
    try {
      await api.deleteRecipe(deleteModalState.recipe.id);
      showToast('Receta eliminada exitosamente', 'success');
      setRecipes(currentRecipes => currentRecipes.filter(r => r.id !== deleteModalState.recipe.id));
      setDeleteModalState({ isOpen: false, recipe: null });
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      // Ensure loading state is reset even if delete takes time
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    // If no recipes are loaded yet, and we are in a loading state (either initial client-side or subsequent)
    if (recipes.length === 0 && isLoading) {
      return <LoadingState showSlowLoadMessage={showSlowLoadMessage} />;
    }
    
    // If no recipes, not loading, and no more to load (e.g., server returned empty and no more available)
    if (recipes.length === 0 && !isLoading && !hasMore) {
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

    return ( // Render recipes if available
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
      
      <div ref={sentinelRef}></div>

      {/* Show spinner only for subsequent loads AND if recipes are already displayed */}
      {isLoading && recipes.length > 0 && <Spinner />}

      {!hasMore && recipes.length > 0 && ( // Only show if there are recipes to display
        <div className="text-center py-10">
          <p className="text-gray-500">No hay más recetas que mostrar.</p>
        </div>
      )}

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