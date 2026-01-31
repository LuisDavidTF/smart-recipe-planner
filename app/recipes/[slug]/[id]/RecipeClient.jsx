'use client';

import React, { useState, useEffect } from 'react';
import { SmartImage } from '@components/ui/SmartImage';
import { ClockIcon, UserIcon } from '@components/ui/Icons';
import { useApiClient } from '@hooks/useApiClient';
import { useSettings } from '@context/SettingsContext';
import { CacheManager } from '@utils/cacheManager';
import { useRouter } from 'next/navigation';
import { useAuth } from '@context/AuthContext';
import { Button } from '@components/ui/Button';
import { EditIcon, TrashIcon } from '@components/ui/Icons';
import { useToast } from '@context/ToastContext';
import { Modal } from '@components/ui/Modal';

// Global map to track in-flight requests for deduplication
const IN_FLIGHT_REQUESTS = new Map();

const normalizeRecipeData = (data) => {
    if (!data) return null;
    return {
        ...data,
        imageUrl: data.imageUrl || data.image_url,
        preparationTimeMinutes: data.preparationTimeMinutes || data.preparation_time_minutes,
        authorName: data.authorName || data.author_name || data.user?.name,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        instructions: Array.isArray(data.instructions) ? data.instructions : [],
    };
};

function useRecipeData(id, initialData) {
    const [recipe, setRecipe] = useState(initialData ? normalizeRecipeData(initialData) : null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(!initialData);
    const api = useApiClient();

    useEffect(() => {
        if (initialData) {
            CacheManager.saveVisitedRecipe(initialData);
            setLoading(false);
            return;
        }

        let mounted = true;
        let foundInCache = false;

        const visited = CacheManager.getVisitedRecipe(id);
        const STALE_MINUTES = 5;
        const isStale = visited && (Date.now() - (visited.timestamp || 0)) > (STALE_MINUTES * 60 * 1000);

        if (visited && !isStale) {
            if (mounted) {
                setRecipe(normalizeRecipeData(visited));
                setLoading(false);
                foundInCache = true;
            }
        } else {
            const feed = CacheManager.getFeed();
            const feedRecipe = feed?.recipes?.find(r => String(r.id) === String(id));
            if (feedRecipe && mounted) {
                setRecipe(normalizeRecipeData(feedRecipe));
                setLoading(false);
                foundInCache = true;
            }
        }

        if (!foundInCache || isStale) {
            let requestPromise = IN_FLIGHT_REQUESTS.get(id);

            if (!requestPromise) {
                requestPromise = api.getRecipeById(id)
                    .then(data => data)
                    .finally(() => {
                        IN_FLIGHT_REQUESTS.delete(id);
                    });

                IN_FLIGHT_REQUESTS.set(id, requestPromise);
                console.log(`[RecipeClient] Started fetch for ${id}`);
            }

            requestPromise
                .then(data => {
                    if (!mounted) return;
                    const recipeData = data?.data || data;
                    recipeData.timestamp = Date.now();
                    const normalized = normalizeRecipeData(recipeData);
                    setRecipe(normalized);
                    setLoading(false);
                    CacheManager.saveVisitedRecipe(normalized);
                })
                .catch(err => {
                    console.error("Fetch failed", err);
                    if (!mounted) return;
                    if (!foundInCache) {
                        setError(err.message);
                        setLoading(false);
                    }
                });
        } else {
            setLoading(false);
        }

        return () => { mounted = false; };
    }, [id, api, initialData]);

    return { recipe, error, loading };
}

function RecipeDetailContent({ recipe }) {
    const { user } = useAuth();
    const { t } = useSettings();
    const router = useRouter();
    const { showToast } = useToast();
    const api = useApiClient();

    const [deleteModalState, setDeleteModalState] = React.useState({ isOpen: false });

    if (!recipe) return null;

    const normalize = (str) => String(str || '').trim().toLowerCase();

    const isOwner = user && (
        (user.id && recipe.user_id && String(user.id) === String(recipe.user_id)) ||
        (user.id && recipe.user?.id && String(user.id) === String(recipe.user.id)) ||
        (user.name && (
            normalize(user.name) === normalize(recipe.authorName) ||
            normalize(user.name) === normalize(recipe.author_name) ||
            normalize(user.name) === normalize(recipe.user?.name)
        ))
    );

    const handleEdit = () => router.push(`/edit-recipe/${recipe.id}`);
    const handleDelete = () => setDeleteModalState({ isOpen: true });

    const confirmDelete = async () => {
        try {
            await api.deleteRecipe(recipe.id);
            showToast(t.feed.deleted, 'success');
            router.push('/');
            router.refresh();
        } catch (error) {
            showToast(error.message || 'Error', 'error');
        }
    };

    let imageUrl = recipe.imageUrl;
    if (imageUrl && imageUrl.startsWith('/')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
            const base = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
            imageUrl = `${base}${imageUrl}`;
        }
    } else if (!imageUrl) {
        imageUrl = `https://placehold.co/600x400/059669/ffffff?text=${t.recipe.chef || 'Culina'}`;
    }

    return (
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-xs overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300 w-full">

            {/* Hero Header (Imagen y Título) - SIN CAMBIOS */}
            <div className="relative w-full h-72 sm:h-96 bg-gray-100">
                <SmartImage
                    src={imageUrl}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 md:p-8 text-white w-full flex flex-col md:flex-row justify-between items-end gap-4">
                        <div className="w-full">
                            <h1 className="text-2xl md:text-4xl font-bold mb-3 shadow-sm break-words leading-tight">
                                {recipe.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm font-medium">
                                <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full whitespace-nowrap">
                                    <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {recipe.preparationTimeMinutes} {t.recipe.time}
                                </span>
                                <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full whitespace-nowrap">
                                    <UserIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    {recipe.authorName || recipe.user?.name || t.recipe.chef}
                                </span>
                            </div>
                        </div>

                        {isOwner && (
                            <div className="hidden sm:flex gap-3 flex-shrink-0">
                                <Button
                                    variant="secondary"
                                    onClick={handleEdit}
                                    className="border-0"
                                >
                                    <EditIcon className="w-4 h-4 mr-2" /> {t.common.edit}
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleDelete}
                                    className="bg-red-500/80 hover:bg-red-600/90 backdrop-blur-md"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" /> {t.common.delete}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- LAYOUT PRINCIPAL REESTRUCTURADO --- */}
            {/* Usamos Grid. 
                - items-start: Importante para que el sticky no se estire.
                - gap-8: Espacio entre elementos tanto vertical como horizontal.
            */}
            <div className="p-4 md:p-8 grid gap-8 md:grid-cols-[2fr_1fr] items-start">

                {/* 1. SECCIÓN DE DESCRIPCIÓN */}
                {/* En Desktop: Columna 1, Fila 1 */}
                <section className="md:col-start-1 md:row-start-1 space-y-6 min-w-0">
                    
                    {/* Botones móviles (solo aparecen si eres dueño y en movil) */}
                    {isOwner && (
                        <div className="flex sm:hidden gap-3 mb-6">
                            <Button
                                variant="secondary"
                                onClick={handleEdit}
                                className="flex-1 justify-center"
                            >
                                <EditIcon className="w-4 h-4 mr-2" /> {t.common.edit}
                            </Button>
                            <Button variant="danger" onClick={handleDelete} className="flex-1 justify-center">
                                <TrashIcon className="w-4 h-4 mr-2" /> {t.common.delete}
                            </Button>
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                            {t.recipe.desc}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg break-words min-w-0">
                            {recipe.description}
                        </p>
                    </div>
                </section>

                {/* 2. SECCIÓN DE INGREDIENTES (SIDEBAR) */}
                {/* TRUCO MAGIA:
                   - HTML: Está en 2da posición, así que en móvil sale DESPUÉS de la descripción y ANTES de instrucciones.
                   - Desktop (md): Le forzamos a ir a la Columna 2 (col-start-2) y ocupar 2 filas (row-span-2) para cubrir el alto de descripción e instrucciones.
                */}
                <aside className="min-w-0 md:col-start-2 md:row-start-1 md:row-span-2">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-4 md:p-6 rounded-xl border border-gray-100 dark:border-gray-700 md:sticky md:top-24 overflow-hidden w-full">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                            {t.recipe.ingr}
                        </h3>
                        <ul className="space-y-4">
                            {recipe.ingredients?.length > 0 ? (
                                recipe.ingredients.map((ing, i) => (
                                    <li key={ing.id || i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between text-sm gap-1 sm:gap-4 border-b border-gray-200/50 dark:border-gray-700/50 pb-2 last:border-0 last:pb-0">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium leading-tight">
                                            {ing.name || ing.ingredient?.name}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 sm:text-right shrink-0 leading-tight">
                                            {ing.quantity} {ing.unitOfMeasure || ing.unit_of_measure}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500 italic text-sm">{t.recipe.noIngr}</li>
                            )}
                        </ul>
                    </div>
                </aside>

                {/* 3. SECCIÓN DE INSTRUCCIONES */}
                {/* En Desktop: Columna 1, Fila 2 (Debajo de la descripción) */}
                <section className="md:col-start-1 md:row-start-2 min-w-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                        {t.recipe.instr}
                    </h2>
                    <div className="space-y-6">
                        {recipe.instructions?.length > 0 ? (
                            recipe.instructions.map((instruction, index) => (
                                <div key={index} className="flex gap-4 group items-start">
                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors mt-0.5">
                                        {index + 1}
                                    </span>
                                    <p className="text-gray-700 dark:text-gray-300 leading-7 break-words flex-1 min-w-0">
                                        {instruction}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">{t.recipe.noInstr}</p>
                        )}
                    </div>
                </section>

            </div>

            <Modal
                isOpen={deleteModalState.isOpen}
                onClose={() => setDeleteModalState({ isOpen: false })}
                title={t.feed.deleteTitle}
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 break-words">
                        {t.feed.deleteConfirm} <strong>{recipe.name}</strong>?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setDeleteModalState({ isOpen: false })}
                        >
                            {t.feed.cancel}
                        </Button>
                        <Button variant="danger" onClick={confirmDelete}>
                            {t.feed.confirmDelete}
                        </Button>
                    </div>
                </div>
            </Modal>
        </article>
    );
}

export default function RecipeClient({ recipe: initialRecipe, recipeId, correctSlug, currentSlug }) {
    const { recipe, error, loading } = useRecipeData(recipeId, initialRecipe);
    const { t } = useSettings();

    useEffect(() => {
        if (correctSlug && correctSlug !== currentSlug) {
            const newPath = `/recipes/${correctSlug}/${recipeId}`;
            window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
        }
    }, [correctSlug, currentSlug, recipeId]);

    if (loading) {
        return <div className="p-10 text-center">{t.recipe.loading}</div>;
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500">
                <p>{t.recipe.error} {error}</p>
                <p className="text-sm mt-2 text-gray-500">{t.recipe.checkNet}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
            <RecipeDetailContent recipe={recipe} />
        </div>
    );
}