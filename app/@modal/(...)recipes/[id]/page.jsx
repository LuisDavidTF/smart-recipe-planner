// app/@modal/(...)recipes/[id]/page.jsx
'use client'

import React, { useState, useEffect, use, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from '@hooks/useApiClient';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';
import { Modal } from '@components/ui/Modal';
import { Button } from '@components/ui/Button';
import { EditIcon, TrashIcon } from '@components/ui/Icons';
import Loading from './loading';



export default function RecipeInterceptModal({ params }) {
    const router = useRouter();
    const api = useApiClient();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [status, setStatus] = useState('loading');
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    const [deleteModalState, setDeleteModalState] = useState({ isOpen: false });

    const { id: recipeId } = use(params);

    useEffect(() => {
        if (!recipeId) return;
        setStatus('loading');
        api.getRecipeById(recipeId)
            .then(data => {
                const recipeData = data?.data || data; // Ajusta a tu API
                setRecipe(recipeData);
                setStatus('success');
            })
            .catch(err => {
                setError(err.message);
                setStatus('error');
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
            showToast('Receta eliminada exitosamente', 'success');
            setDeleteModalState({ isOpen: false });
            router.refresh(); // ¡Refresca el feed detrás!
            handleClose(); // Cierra el modal
        } catch (error) {
            showToast(error.message, 'error');
        }
    };

    const isOwner = user && recipe && user.id === recipe.user_id;

    return (
        <>
            <Modal
                isOpen={true}
                onClose={handleClose}
                title={recipe?.name || 'Cargando...'}
            >
                <Suspense felback={<Loading />}>
                    {status === 'loading' && <Loading />}
                </Suspense>
                {status === 'error' && <div className="text-red-600">{error}</div>}
                {status === 'success' && recipe && (
                    <>
                        {/* Reutilizamos el contenido */}
                        <RecipeDetailContent recipe={recipe} />

                        {/* Re-implementamos los botones que estaban en tu modal original */}
                        {isOwner && (
                            <div className="border-t mt-6 pt-4 flex gap-4">
                                <Button variant="secondary" onClick={handleEdit} className="flex-1">
                                    <EditIcon className="w-4 h-4 mr-2" /> Editar
                                </Button>
                                <Button variant="danger" onClick={handleDelete} className="flex-1">
                                    <TrashIcon className="w-4 h-4 mr-2" /> Eliminar
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
                title="Confirmar Eliminación"
            >
                <p>¿Estás seguro de que quieres eliminar la receta "<strong>{recipe?.name}</strong>"?</p>
                <div className="flex gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setDeleteModalState({ isOpen: false })} className="w-full">Cancelar</Button>
                    <Button variant="danger" onClick={confirmDelete} className="w-full">Sí, eliminar</Button>
                </div>
            </Modal>
        </>
    );
}
function RecipeDetailContent({ recipe }) {
    return (
        <>
            <img src={recipe.image_url || 'https://placehold.co/600x400'} alt={recipe.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <p className="text-gray-700 mb-4">{recipe.description}</p>
            <p><strong>Tiempo:</strong> {recipe.preparation_time_minutes} min</p>
            <p><strong>Por:</strong> {recipe.user?.name || 'Anónimo'}</p>
            <h4 className="font-semibold mt-4 mb-2">Ingredientes:</h4>
            <ul>{recipe.ingredients?.map((ing, i) => <li key={ing.id || i}>{ing.quantity} {ing.unit_of_measure} de {ing.ingredient.name}</li>) || <li>No listados</li>}</ul>
            <h4 className="font-semibold mt-4 mb-2">Instrucciones:</h4>
            <div>{recipe.instructions && Object.entries(recipe.instructions).map(([step, text]) => <p key={step}><strong>{step}:</strong> {text}</p>)}</div>
        </>
    );
}