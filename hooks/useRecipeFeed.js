import { useState, useRef, useCallback, useEffect } from 'react';
import { useApiClient } from '@hooks/useApiClient';
import { useToast } from '@context/ToastContext';

/**
 * Custom hook to handle recipe fetching, pagination, and infinite scroll logic.
 * Separation of Concerns: Keeps the UI component clean and focused on presentation.
 */
export function useRecipeFeed() {
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [recipes, setRecipes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSlowLoadMessage, setShowSlowLoadMessage] = useState(false);

    // Pagination
    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const api = useApiClient();
    const { showToast } = useToast();

    // Refs for tracking state inside callbacks/effects
    const stateRef = useRef({ isLoadingMore, hasMore, nextCursor });
    stateRef.current = { isLoadingMore, hasMore, nextCursor };

    // Slow Load Message Logic
    useEffect(() => {
        let timer;
        if (status === 'loading') {
            timer = setTimeout(() => {
                setStatus(current => {
                    if (current === 'loading') setShowSlowLoadMessage(true);
                    return current;
                });
            }, 3000);
        } else {
            setShowSlowLoadMessage(false);
        }
        return () => clearTimeout(timer);
    }, [status]);

    // Initial Fetch
    const fetchInitialRecipes = useCallback(async () => {
        setStatus('loading');
        setErrorMessage('');
        setShowSlowLoadMessage(false);

        try {
            const data = await api.getRecipes();
            setRecipes(data.data || []);
            setNextCursor(data.nextCursor);
            setHasMore(!!data.nextCursor);
            setStatus('success');
        } catch (error) {
            setErrorMessage(error.message || 'Error al cargar recetas');
            setStatus('error');
        }
    }, [api]);

    // Infinite Scroll Fetch
    const fetchMoreRecipes = useCallback(async () => {
        if (stateRef.current.isLoadingMore || !stateRef.current.hasMore) return;

        setIsLoadingMore(true);
        try {
            const params = {};
            if (stateRef.current.nextCursor) {
                params.cursorId = stateRef.current.nextCursor.id;
                params.cursorDate = stateRef.current.nextCursor.createdAt;
            }

            const { data: newRecipes, nextCursor: newNextCursor } = await api.getRecipes(params);

            setRecipes(prev => {
                const newIds = new Set(prev.map(r => r.id));
                const unique = newRecipes.filter(r => !newIds.has(r.id));
                return [...prev, ...unique];
            });

            setNextCursor(newNextCursor);
            setHasMore(!!newNextCursor && newRecipes.length > 0);
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            setIsLoadingMore(false);
        }
    }, [api, showToast]);

    // Helper to remove a recipe locally (optimistic update)
    const removeRecipe = useCallback((id) => {
        setRecipes(prev => prev.filter(r => r.id !== id));
    }, []);

    // Initial load effect
    useEffect(() => {
        fetchInitialRecipes();
    }, [fetchInitialRecipes]);

    return {
        recipes,
        status,
        errorMessage,
        showSlowLoadMessage,
        hasMore,
        isLoadingMore,
        fetchMoreRecipes,
        fetchInitialRecipes,
        removeRecipe
    };
}
