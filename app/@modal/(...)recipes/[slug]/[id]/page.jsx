// app/@modal/(...)recipes/[slug]/[id]/page.jsx
'use client'
export const runtime = 'edge';

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApiClient } from '@hooks/useApiClient';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { SmartImage } from '@components/ui/SmartImage';
import { EditIcon, TrashIcon } from '@components/ui/Icons';
import Loading from './loading';
import { useSettings } from '@context/SettingsContext';
import { CacheManager } from '@utils/cacheManager';

// ... imports

export default function RecipeInterceptModal({ params }) {
    const router = useRouter();
    const pathname = usePathname();
    const api = useApiClient();
    const { user } = useAuth();
    const { showToast } = useToast();
    const { t } = useSettings();

    const [status, setStatus] = useState('loading');
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false });

    // Extract both params even if we only use ID
    const { id: recipeId, slug: recipeSlug } = use(params);

    useEffect(() => {
        if (!recipeId) return;

        // 1. CACHE-FIRST STRATEGY (Instant Load)
        // Priority: Visited Cache (Exact Match) -> Feed Cache (List Search)
        let foundInCache = false;

        // Check Visited (LRU) - This has full details
        const visitedCache = CacheManager.getVisitedRecipe(recipeId);
        if (visitedCache) {
            console.log(`[Cache Hit] Recipe ${recipeId} found in Visited Storage.`);
            setRecipe(visitedCache);
            setStatus('success');
            foundInCache = true;
        } else {
            // Check Feed (Fallback) - This might be partial, but better than nothing
            const feedCache = CacheManager.getFeed();
            const feedRecipe = feedCache?.recipes?.find(r => String(r.id) === String(recipeId));
            if (feedRecipe) {
                console.log(`[Cache Hit] Recipe ${recipeId} found in Feed Storage.`);
                setRecipe(feedRecipe);
                setStatus('success');
                foundInCache = true;
            }
        }

        // 2. NETWORK REVALIDATE (Stale-While-Revalidate)
        if (!foundInCache) setStatus('loading');

        api.getRecipeById(recipeId)
            .then(data => {
                const recipeData = data?.data || data;
                setRecipe(recipeData);
                setStatus('success');

                // SAVE TO VISITED CACHE (Stores full details)
                CacheManager.saveVisitedRecipe(recipeData);
            })
            .catch(err => {
                // If we already have cache, don't show error (silent fail)
                if (!foundInCache) {
                    setError(err.message);
                    setStatus('error');
                }
            });
    }, [recipeId, api]);

    const handleClose = () => router.back();

    const handleEdit = () => {
        // 1. Primero, cierra el modal
        router.back();

        // 2. Dale al router un instante para procesar el 'back()'
        setTimeout(() => {
            // 3. Ahora, navega a la página de edición
            router.push(`/edit-recipe/${recipe.id}`);
        }, 50); // 50ms es suficiente
    };

    const handleDelete = () => setDeleteModalState({ isOpen: true });

    const confirmDelete = async () => {
        if (!recipe) return;
        try {
            await api.deleteRecipe(recipe.id);
            showToast(t.feed.deleted, 'success');
            setDeleteModalState({ isOpen: false });
            router.refresh(); // ¡Refresca el feed detrás!
            handleClose(); // Cierra el modal
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const normalize = (str) => String(str || '').trim().toLowerCase();

    const isOwner = user && recipe && (
        (user.id && recipe.user_id && String(user.id) === String(recipe.user_id)) ||
        (user.name && (
            normalize(user.name) === normalize(recipe.authorName) ||
            normalize(user.name) === normalize(recipe.author_name) ||
            normalize(user.name) === normalize(recipe.user?.name)
        ))
    );

    return (
        <>
            <Modal
                isOpen={true}
                onClose={handleClose}
                title={recipe?.name || t.recipe.loading}
            >
                <Suspense fallback={<Loading />}>
                    {status === 'loading' && <Loading />}
                </Suspense>
                {status === 'error' && <div className="text-red-600">{error}</div>}
                {status === 'success' && recipe && (
                    <>
                        {/* Reutilizamos el contenido */}
                        <RecipeDetailContent recipe={recipe} t={t} />

                        {/* Re-implementamos los botones que estaban en tu modal original */}
                        {isOwner && (
                            <div className="border-t mt-6 pt-4 flex gap-4">
                                <Button
                                    variant="secondary"
                                    onClick={handleEdit}
                                    className="flex-1"
                                >
                                    <EditIcon className="w-4 h-4 mr-2" /> {t.common.edit}
                                </Button>
                                <Button variant="danger" onClick={handleDelete} className="flex-1">
                                    <TrashIcon className="w-4 h-4 mr-2" /> {t.common.delete}
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </Modal>

            {/* Modal de confirmación de borrado, anidado */}
            <Modal
                isOpen={deleteModalState.isOpen}
                onClose={() => setDeleteModalState({ isOpen: false })}
                title={t.feed.deleteTitle}
            >
                <p>{t.feed.deleteConfirm} "<strong>{recipe?.name}</strong>"?</p>
                <div className="flex gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setDeleteModalState({ isOpen: false })} className="w-full">{t.common.cancel}</Button>
                    <Button variant="danger" onClick={confirmDelete} className="w-full">{t.feed.confirmDelete}</Button>
                </div>
            </Modal>
        </>
    );
}

function RecipeDetailContent({ recipe, t }) {
    // 1. Guard Clause: Prevención de "crash" si el modal se abre antes de que los datos carguen.
    if (!recipe) return null;

    // Localized placeholder
    const placeholderText = t.recipe.chef || 'Culina';

    return (
        <>
            {/* Visual Stability: Definir aspect-ratio o altura fija evita saltos de layout si la imagen tarda en cargar */}
            <SmartImage
                src={recipe.imageUrl || `https://placehold.co/600x400?text=${placeholderText}`}
                alt={recipe.name}
                className="w-full h-64 object-cover rounded-lg mb-4 bg-gray-100 dark:bg-gray-700"
            />

            <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">{recipe.description}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <p><span className="font-bold text-gray-900 dark:text-gray-100">{t.recipe.timeLabel}</span> {recipe.preparationTimeMinutes} min</p>
                <p><span className="font-bold text-gray-900 dark:text-gray-100">{t.recipe.byLabel}</span> {recipe.authorName || recipe.user?.name || t.recipe.chef}</p>
            </div>

            {/* --- INGREDIENTES --- */}
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">{t.recipe.ingr}:</h4>
            <ul className="list-disc list-inside mb-6 space-y-1 text-gray-700 dark:text-gray-300">
                {/* Check explícito de .length para evitar renderizar contenedores vacíos */}
                {recipe.ingredients?.length > 0 ? (
                    recipe.ingredients.map((ing, i) => (
                        <li key={ing.id || i}>
                            <span className="font-medium">{ing.quantity} {ing.unitOfMeasure || ing.unit_of_measure}</span> {ing.name || ing.ingredient?.name}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-400 italic list-none">{t.recipe.noIngr}</li>
                )}
            </ul>

            {/* --- INSTRUCCIONES (MIGRADO A ARRAY) --- */}
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">{t.recipe.instr}:</h4>
            <div className="space-y-3">
                {/* ADAPTACIÓN A SCHEMA LIST<STRING>:
                   - Eliminamos Object.entries() que causaría error con el nuevo array.
                   - Usamos el índice del map (index + 1) para la numeración visual.
                   - Flexbox para alineación: evita que el texto largo se meta debajo del número del paso.
                */}
                {recipe.instructions?.length > 0 ? (
                    recipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                            <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap min-w-[3.5rem]">
                                {t.createRecipe.step} {index + 1}:
                            </span>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {instruction}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">{t.recipe.noInstr}</p>
                )}
            </div>
        </>
    );
}
