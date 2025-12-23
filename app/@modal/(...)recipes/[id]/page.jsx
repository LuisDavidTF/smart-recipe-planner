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
    // 1. Guard Clause: Prevención de "crash" si el modal se abre antes de que los datos carguen.
    if (!recipe) return null;

    return (
        <>
            {/* Visual Stability: Definir aspect-ratio o altura fija evita saltos de layout si la imagen tarda en cargar */}
            <img 
                src={recipe.image_url || 'https://placehold.co/600x400'} 
                alt={recipe.name} 
                className="w-full h-64 object-cover rounded-lg mb-4 bg-gray-100" 
            />
            
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <p><span className="font-bold text-gray-900">Tiempo:</span> {recipe.preparation_time_minutes} min</p>
                <p><span className="font-bold text-gray-900">Por:</span> {recipe.user?.name || 'Anónimo'}</p>
            </div>

            {/* --- INGREDIENTES --- */}
            <h4 className="font-bold text-gray-900 mt-4 mb-2">Ingredientes:</h4>
            <ul className="list-disc list-inside mb-6 space-y-1 text-gray-700">
                {/* Check explícito de .length para evitar renderizar contenedores vacíos */}
                {recipe.ingredients?.length > 0 ? (
                    recipe.ingredients.map((ing, i) => (
                        <li key={ing.id || i}>
                            <span className="font-medium">{ing.quantity} {ing.unit_of_measure}</span> de {ing.ingredient.name}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-400 italic list-none">No hay ingredientes especificados.</li>
                )}
            </ul>

            {/* --- INSTRUCCIONES (MIGRADO A ARRAY) --- */}
            <h4 className="font-bold text-gray-900 mt-4 mb-2">Instrucciones:</h4>
            <div className="space-y-3">
                {/* ADAPTACIÓN A SCHEMA LIST<STRING>:
                   - Eliminamos Object.entries() que causaría error con el nuevo array.
                   - Usamos el índice del map (index + 1) para la numeración visual.
                   - Flexbox para alineación: evita que el texto largo se meta debajo del número del paso.
                */}
                {recipe.instructions?.length > 0 ? (
                    recipe.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                            <span className="font-bold text-gray-900 whitespace-nowrap min-w-[3.5rem]">
                                Paso {index + 1}:
                            </span>
                            <p className="text-gray-700 leading-relaxed">
                                {instruction}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 italic">Sin instrucciones detalladas.</p>
                )}
            </div>
        </>
    );
}