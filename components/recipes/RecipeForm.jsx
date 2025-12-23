'use client'

import React, { useRef } from 'react';
import Link from 'next/link';
import { FormInput } from '@components/ui/FormInput'; 
import { Button } from '@components/ui/Button'; 
import { ErrorState } from '@components/ui/ErrorState'; 

// Feature Components
import { InstructionsManager } from './form/InstructionsManager';
import { IngredientsManager } from './form/IngredientsManager';
import { MagicGenerator } from './form/MagicGenerator'; // Asumo que ya tienes o adaptas este componente similar a los otros

// Logic Hook
import { useRecipeForm } from '@hooks/useRecipeForm';

export function RecipeForm({ recipeId }) {
  const { 
    formData, 
    status, 
    errors, 
    apiError, 
    handlers 
  } = useRecipeForm(recipeId);

  const isEditMode = !!recipeId;

  // Refs for UX enhancements (scroll to error) can be implemented here if needed

  if (status === 'loading') {
    return <div className="p-12 text-center text-gray-500 animate-pulse">Cargando datos de la receta...</div>;
  }

  if (status === 'error') {
    return <ErrorState message={apiError} onRetry={handlers.retry} />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg border border-gray-100 mb-20">
      <div className="mb-8 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Editar Receta' : 'Nueva Receta'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isEditMode ? 'Modifica los detalles de tu receta existente.' : 'Comparte tu creación culinaria con el mundo.'}
        </p>
      </div>

      {/* AI Feature - Only for Create Mode */}
      {!isEditMode && (
        <div className="mb-8">
          <MagicGenerator onDraftGenerated={handlers.handleDraftLoaded} />
        </div>
      )}

      <form onSubmit={handlers.submit} className="space-y-8">
        
        {/* --- General Information Section --- */}
        <div className="space-y-5">
            <FormInput 
                id="name" 
                label="Nombre de la receta" 
                value={formData.name} 
                onChange={(e) => handlers.setFieldValue('name', e.target.value)} 
                error={errors.name}
                required
            />
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea 
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-emerald-500 focus:border-emerald-500 shadow-sm transition-colors ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.description}
                    onChange={(e) => handlers.setFieldValue('description', e.target.value)}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput 
                    id="prepTime" 
                    label="Tiempo de Prep. (min)" 
                    type="number"
                    value={formData.preparationTime} 
                    onChange={(e) => handlers.setFieldValue('preparationTime', e.target.value)} 
                    error={errors.preparationTime}
                />
                <FormInput 
                    id="imageUrl" 
                    label="URL de la Imagen" 
                    value={formData.imageUrl} 
                    onChange={(e) => handlers.setFieldValue('imageUrl', e.target.value)} 
                    error={errors.imageUrl}
                />
            </div>
        </div>

        <hr className="border-gray-100" />

        {/* --- Ingredients Section --- */}
        <IngredientsManager 
            ingredients={formData.ingredients}
            onChange={handlers.handleIngredientChange}
            onAdd={() => handlers.modifyList('ingredients', 'add')}
            onRemove={(index) => handlers.modifyList('ingredients', 'remove', index)}
            error={errors.ingredientsRoot}
        />

        <hr className="border-gray-100" />

        {/* --- Instructions Section (Strict Array Handling) --- */}
        <InstructionsManager 
            instructions={formData.instructions}
            onChange={handlers.handleInstructionChange}
            onAdd={() => handlers.modifyList('instructions', 'add')}
            onRemove={(index) => handlers.modifyList('instructions', 'remove', index)}
            error={errors.instructionsRoot}
        />

        <hr className="border-gray-100" />

        {/* --- Metadata Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-lg border border-gray-100">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Tipo de Comida
                </label>
                <select 
                    value={formData.type} 
                    onChange={(e) => handlers.setFieldValue('type', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                >
                    <option value="breakfast">Desayuno</option>
                    <option value="lunch">Comida</option>
                    <option value="dinner">Cena</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Visibilidad
                </label>
                <select 
                    value={formData.visibility} 
                    onChange={(e) => handlers.setFieldValue('visibility', e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-emerald-500 focus:border-emerald-500"
                >
                    <option value="public">Pública</option>
                    <option value="private">Privada</option>
                </select>
             </div>
        </div>

        {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{apiError}</span>
            </div>
        )}

        {/* --- Action Buttons --- */}
        <div className="flex gap-4 pt-4">
          <Link 
            href="/" 
            className="flex-1 text-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
          >
            Cancelar
          </Link>
          <Button 
            type="submit" 
            isLoading={status === 'submitting'} 
            className="flex-1 py-3 text-sm font-medium shadow-md hover:shadow-lg transition-all"
          >
            {isEditMode ? 'Guardar Cambios' : 'Publicar Receta'}
          </Button>
        </div>

      </form>
    </div>
  );
}