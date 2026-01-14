'use client';

import React, { useState, useEffect } from 'react';
import { SmartImage } from '@components/ui/SmartImage';
import { ClockIcon, UserIcon } from '@components/ui/Icons';
import { useApiClient } from '@hooks/useApiClient';
import { useSettings } from '@context/SettingsContext';
import { CacheManager } from '@utils/cacheManager';
import { useRouter } from 'next/navigation';

function useRecipeData(id, initialData) {
    const [recipe, setRecipe] = useState(initialData || null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(!initialData);
    const api = useApiClient();

    useEffect(() => {
        // If we have initial data, we just save it to cache and return (or maybe fetch fresh in background?)
        // For now, let's treat initialData as authoritative for the first render.
        if (initialData) {
            CacheManager.saveVisitedRecipe(initialData);
            setLoading(false);
            // We could optionally fetch fresh data here silently
            return;
        }

        let mounted = true;
        let foundInCache = false;

        // 1. Check Offline Storage first (Visited -> Feed)
        const visited = CacheManager.getVisitedRecipe(id);
        if (visited) {
            if (mounted) {
                setRecipe(visited);
                setLoading(false);
                foundInCache = true;
            }
        } else {
            // Fallback to feed cache
            const feed = CacheManager.getFeed();
            const feedRecipe = feed?.recipes?.find(r => String(r.id) === String(id));
            if (feedRecipe && mounted) {
                setRecipe(feedRecipe);
                setLoading(false);
                foundInCache = true;
            }
        }

        // 2. Fetch fresh data
        api.getRecipeById(id)
            .then(data => {
                if (!mounted) return;
                const recipeData = data?.data || data;
                setRecipe(recipeData);
                setLoading(false);

                // SAVE VISITED
                CacheManager.saveVisitedRecipe(recipeData);
            })
            .catch(err => {
                console.error("Fetch failed", err);
                if (!mounted) return;
                if (!foundInCache) {
                    setError(err.message);
                    setLoading(false);
                }
            });

        return () => { mounted = false; };
    }, [id, api, initialData]);

    return { recipe, error, loading };
}

function RecipeDetailContent({ recipe }) {
    const { t } = useSettings();

    if (!recipe) return null;

    // Use the image directly from the recipe object. The SmartImage component handles errors/fallbacks.
    // Use the image directly from the recipe object. The SmartImage component handles errors/fallbacks.
    let imageUrl = recipe.image_url;

    // Resolve relative URLs
    if (imageUrl && imageUrl.startsWith('/')) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (apiUrl) {
            // Avoid double slashes if apiUrl ends with /
            const base = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
            imageUrl = `${base}${imageUrl}`;
        }
    } else if (!imageUrl) {
        // If no image URL exists, use a default placeholder
        imageUrl = `https://placehold.co/600x400/059669/ffffff?text=${t.recipe.chef || 'Culina'}`;
    }

    return (
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-xs overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-300">

            {/* Hero Header with Image */}
            <div className="relative w-full h-72 sm:h-96 bg-gray-100">
                <SmartImage
                    src={imageUrl}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-6 md:p-8 text-white w-full">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 shadow-sm">{recipe.name}</h1>
                        <div className="flex items-center gap-4 text-sm font-medium">
                            <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                <ClockIcon className="w-4 h-4 mr-2" />
                                {recipe.preparation_time_minutes} {t.recipe.time}
                            </span>
                            <span className="flex items-center bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                                <UserIcon className="w-4 h-4 mr-2" />
                                {recipe.user?.name || t.recipe.chef}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 grid gap-8 md:grid-cols-[2fr_1fr]">

                {/* Main Content */}
                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-3 flex items-center">
                            {t.recipe.desc}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            {recipe.description}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                            {t.recipe.instr}
                        </h2>
                        <div className="space-y-6">
                            {recipe.instructions?.length > 0 ? (
                                recipe.instructions.map((instruction, index) => (
                                    <div key={index} className="flex gap-4 group">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold text-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            {index + 1}
                                        </span>
                                        <p className="text-gray-700 dark:text-gray-300 leading-7 mt-1">
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

                {/* Sidebar / Ingredients */}
                <aside>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-600 pb-2">
                            {t.recipe.ingr}
                        </h3>
                        <ul className="space-y-3">
                            {recipe.ingredients?.length > 0 ? (
                                recipe.ingredients.map((ing, i) => (
                                    <li key={ing.id || i} className="flex items-start justify-between text-sm">
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{ing.ingredient.name}</span>
                                        <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                            {ing.quantity} {ing.unit_of_measure}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-500 italic text-sm">{t.recipe.noIngr}</li>
                            )}
                        </ul>
                    </div>
                </aside>

            </div>
        </article>
    );
}

export default function RecipeClient({ recipe: initialRecipe, recipeId, correctSlug, currentSlug }) {
    const { recipe, error, loading } = useRecipeData(recipeId, initialRecipe);
    const { t } = useSettings();
    const router = useRouter();

    useEffect(() => {
        // HBO-style URL correction
        if (correctSlug && correctSlug !== currentSlug) {
            // HBO-style URL correction using History API directly to avoid triggering Next.js interception/modals
            const newPath = `/recipes/${correctSlug}/${recipeId}`;
            window.history.replaceState({ ...window.history.state, as: newPath, url: newPath }, '', newPath);
        }
    }, [correctSlug, currentSlug, recipeId]); // Removed router dependence

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
