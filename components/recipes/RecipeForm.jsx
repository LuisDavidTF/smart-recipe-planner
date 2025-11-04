
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApiClient } from '@hooks/useApiClient';
import { useToast } from '@context/ToastContext'; 
import { FormInput } from '@components/ui/FormInput'; 
import { Button } from '@components/ui/Button'; 
import { ErrorState } from '@components/ui/ErrorState'; 
import { TrashIcon, SparklesIcon } from '@components/ui/Icons'; 

export function RecipeForm({ recipeId }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    preparationTime: '',
    imageUrl: '',
    ingredients: [{ name: '', quantity: '', unit_of_measure: '' }],
    instructions: [''],
    type: 'lunch',
    visibility: 'public',
  });
  const [status, setStatus] = useState('loading'); 
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({}); 

  const [magicPrompt, setMagicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const preparationTimeRef = useRef(null);
  const imageUrlRef = useRef(null);
  const ingredientsRef = useRef(null);
  const instructionsRef = useRef(null);

  const api = useApiClient();
  const { showToast } = useToast();
  const router = useRouter();
  const isEditMode = !!recipeId;

  useEffect(() => {
    if (isEditMode) {
      setStatus('loading');
      api.getRecipeById(recipeId)
        .then(recipe => {
          setFormData({
            name: recipe.name || '',
            description: recipe.description || '',
            preparationTime: recipe.preparation_time_minutes || '',
            imageUrl: recipe.image_url || '',
            ingredients: recipe.ingredients.map(ing => ({
              name: ing.ingredient.name || '',
              quantity: ing.quantity || '',
              unit_of_measure: ing.unit_of_measure || '',
            })),
            instructions: Object.values(recipe.instructions || {}),
            type: recipe.type || 'lunch',
            visibility: recipe.visibility || 'public',
          });
          setStatus('idle');
        })
        .catch(err => {
          setApiError(err.message);
          setStatus('error');
        });
    } else {
      setStatus('idle'); 
    }
  }, [recipeId, api, isEditMode]);
  const scrollToFirstError = (validationErrors) => {
    const errorPriority = [
      'name',
      'description',
      'preparationTime',
      'imageUrl',
      'ingredientsRoot',
      'instructionsRoot'
    ];
    const refMap = {
      name: nameRef,
      description: descriptionRef,
      preparationTime: preparationTimeRef,
      imageUrl: imageUrlRef,
      ingredientsRoot: ingredientsRef,
      instructionsRoot: instructionsRef
    };
    const firstErrorKey = errorPriority.find(key => validationErrors[key]);
    if (firstErrorKey && refMap[firstErrorKey]?.current) {
      refMap[firstErrorKey].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const validationErrors = validateForm();
    if (validationErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: validationErrors[name] }));
    } else {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const clearRootError = (errorKey) => {
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    clearRootError('ingredientsRoot');
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit_of_measure: '' }]
    }));
    clearRootError('ingredientsRoot');
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    clearRootError('ingredientsRoot');
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
    clearRootError('instructionsRoot'); 
  };

  const addInstruction = () => {
    setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
    if (errors.instructionsRoot) {
      setErrors(prev => ({ ...prev, instructionsRoot: undefined }));
    }
  };

  const removeInstruction = (index) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
    clearRootError('instructionsRoot'); 
  };

  const validateForm = () => {
    const newErrors = {};
    const { name, description, preparationTime, imageUrl, ingredients, instructions } = formData;

    if (!name || name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!description || description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres.';
    }
    if (!imageUrl || !imageUrl.trim()) {
      newErrors.imageUrl = 'La URL de la imagen es obligatoria.';
    } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      newErrors.imageUrl = 'La URL de la imagen no es válida (debe empezar con http:// o https://).';
    }
    if (!preparationTime || String(preparationTime).trim() === '') {
      newErrors.preparationTime = 'El tiempo de preparación es obligatorio.';
    } else {
      const prepTime = parseInt(preparationTime, 10);
      if (isNaN(prepTime) || prepTime <= 0) {
        newErrors.preparationTime = 'El tiempo de preparación debe ser un número positivo.';
      }
    }
    const validInstructions = instructions.filter(step => step && step.trim() !== '');
    if (validInstructions.length === 0) {
      newErrors.instructionsRoot = 'Añade al menos una instrucción válida.';
    }
    const validIngredientRows = ingredients.filter(ing =>
      (ing.name && ing.name.trim() !== '') ||
      (ing.quantity && ing.quantity.trim() !== '') ||
      (ing.unit_of_measure && ing.unit_of_measure.trim() !== '')
    );
    if (validIngredientRows.length === 0) {
      newErrors.ingredientsRoot = 'La receta debe tener al menos un ingrediente.';
    } else {
      const hasInvalidRow = validIngredientRows.some(ing => {
        if (!ing.name || !ing.name.trim() || !ing.unit_of_measure || !ing.unit_of_measure.trim()) {
          return true;
        }
        const hasQuantity = ing.quantity && ing.quantity.trim() !== '';
        if (hasQuantity) {
          const num = parseFloat(ing.quantity);
          if (isNaN(num) || num <= 0) {
            return true;
          }
        }
        return false;
      });
      if (hasInvalidRow) {
        newErrors.ingredientsRoot = 'Revisa los ingredientes: cada uno debe tener nombre, unidad y, si se incluye, una cantidad numérica positiva (ej: 0.5, 1).';
      }
    }
    return newErrors;
  };

  const handleGenerateDraft = async () => {
    if (!magicPrompt.trim()) {
      setGenerationError("Por favor, escribe una idea para la receta.");
      return;
    }
    setGenerationError(null);
    setIsGenerating(true);
    setApiError(null);

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: magicPrompt }),
      });
      
      const draft = await res.json(); 

      if (!res.ok) {
        throw new Error(draft.message || 'Error al generar el borrador');
      }

      const placeholderImageUrl = `https://placehold.co/600x400/e2e8f0/475569?text=AI+Generated`;
      setFormData({
        ...formData,
        name: draft.name || '',
        description: draft.description || '',
        preparationTime: String(draft.preparationTime || ''),
        imageUrl: placeholderImageUrl,
        ingredients: draft.ingredients.length > 0 ? draft.ingredients : [{ name: '', quantity: '', unit_of_measure: '' }],
        instructions: draft.instructions.length > 0 ? draft.instructions : [''],
        type: draft.type,
        visibility: formData.visibility,
      });

      showToast('Borrador generado con IA', 'success');
      const validationErrors = validateForm();
      setErrors({});
      scrollToFirstError(validationErrors);

    } catch (err) {
      setGenerationError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      scrollToFirstError(validationErrors);
      setStatus('idle');
      return;
    }

    setErrors({});
    setStatus('submitting');

    const validIngredients = formData.ingredients
      .filter(ing => ing && ing.name && ing.name.trim() !== '' && ing.unit_of_measure && ing.unit_of_measure.trim() !== '')
      .map(ing => {
        const quantityNum = parseFloat(ing.quantity);
        const hasQuantity = ing.quantity && ing.quantity.trim() !== '';
        return {
          name: ing.name.trim(),
          unit_of_measure: ing.unit_of_measure.trim(),
          quantity: (hasQuantity && !isNaN(quantityNum) && quantityNum > 0) ? quantityNum : undefined
        };
      });

    const instructionsObject = formData.instructions
      .filter(step => step && step.trim() !== '')
      .reduce((acc, step, index) => {
        acc[`Paso ${index + 1}`] = step;
        return acc;
      }, {});

    const prepTime = parseInt(formData.preparationTime, 10);

    const recipeData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      visibility: formData.visibility,
      ingredients: validIngredients,
      instructions: instructionsObject,
      preparation_time_minutes: prepTime,
      image_url: formData.imageUrl.trim(),
    };

    try {
      if (isEditMode) {
        await api.updateRecipe(recipeId, recipeData);
        showToast('Receta actualizada', 'success');
      } else {
        await api.createRecipe(recipeData);
        showToast('Receta creada', 'success');
      }
      
      router.push('/'); 
      router.refresh(); 
      
    } catch (err) {
      setApiError(err.message);
      setStatus('idle');
    }
  };

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8">
        <p className="text-center text-gray-600">Cargando datos de la receta...</p>
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorState message={apiError} onRetry={() => router.push('/')} />;
  }
  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl mb-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
        {isEditMode ? 'Editar Receta' : 'Crear Nueva Receta'}
      </h2>

      {/* --- Sección de Gemini --- */}
      {!isEditMode && (
        <div className="mb-8 p-4 border border-emerald-200 rounded-lg bg-emerald-50 shadow-sm">
          <label htmlFor="magic-prompt" className="flex items-center text-lg font-semibold text-emerald-800 mb-2">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Generación Mágica
          </label>
          <p className="text-sm text-gray-600 mb-3">
            Escribe una idea simple (ej: "Sopa de pollo y verduras para 2") y deja que la IA genere un borrador por ti.
          </p>
          <textarea
            id="magic-prompt"
            rows="2"
            value={magicPrompt}
            onChange={(e) => setMagicPrompt(e.target.value)}
            placeholder="Ej: Pasta carbonara fácil y rápida..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {generationError && (
            <p className="mt-1 text-xs text-red-600">{generationError}</p>
          )}
          <Button
            type="button"
            onClick={handleGenerateDraft}
            isLoading={isGenerating}
            className="w-auto px-4 py-2 mt-3 !text-sm"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generando...' : 'Generar Borrador'}
          </Button>
        </div>
      )}

      {/* --- Formulario Principal --- */}
      <div className="relative">
        {/* --- Overlay de Carga de Gemini --- */}
        {isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg border">
            <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-3 text-lg font-semibold text-gray-700">Generando receta...</p>
            <p className="text-sm text-gray-500">Esto puede tardar un momento.</p>
          </div>
        )}

        <fieldset disabled={isGenerating}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* --- Nombre --- */}
            <div ref={nameRef}>
              <FormInput id="name" label="Nombre de la Receta" value={formData.name} onChange={handleChange} onBlur={handleBlur} required
                error={errors.name}
              />
            </div>

            {/* --- Descripción --- */}
            <div ref={descriptionRef}>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
                required
              ></textarea>
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* --- Tiempo --- */}
              <div ref={preparationTimeRef}>
                <FormInput
                  id="preparationTime"
                  label="Tiempo de Prep. (min)"
                  type="number"
                  value={formData.preparationTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={errors.preparationTime}
                />
              </div>
              {/* --- URL Imagen --- */}
              <div ref={imageUrlRef}>
                <FormInput
                  id="imageUrl"
                  label="URL de la Imagen"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={errors.imageUrl}
                />
              </div>
            </div>

            {/* --- Ingredientes --- */}
            <div ref={ingredientsRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ingredientes</label>
              {errors.ingredientsRoot && <p className="mb-2 text-xs text-red-600">{errors.ingredientsRoot}</p>}
              {formData.ingredients.map((ing, index) => (
                <div key={index} className="grid grid-cols-8 gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="col-span-3 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Cantidad"
                    value={ing.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Unidad"
                    value={ing.unit_of_measure}
                    onChange={(e) => handleIngredientChange(index, 'unit_of_measure', e.target.value)}
                    className="col-span-2 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="col-span-1 text-red-500 hover:text-red-700 flex justify-center items-center"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                + Añadir Ingrediente
              </button>
            </div>

            {/* --- Instrucciones --- */}
            <div ref={instructionsRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instrucciones</label>
              {errors.instructionsRoot && <p className="mb-2 text-xs text-red-600">{errors.instructionsRoot}</p>}
              {formData.instructions.map((step, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 font-medium">Paso {index + 1}:</span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeInstruction(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addInstruction}
                className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-500"
              >
                + Añadir Paso
              </button>
            </div>

            {/* --- Campos Opcionales (Type/Visibility) --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="breakfast">Desayuno</option>
                  <option value="lunch">Comida</option>
                  <option value="dinner">Cena</option>
                </select>
              </div>
              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">Visibilidad</label>
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="public">Pública</option>
                  <option value="private">Privada</option>
                </select>
              </div>
            </div>

            {apiError && (
              <p className="text-sm text-red-600 text-center">{apiError}</p>
            )}

            {/* --- Botones de Acción --- */}
            <div className="flex gap-4 pt-4">
              
              {/*Botón "Cancelar" ahora es un <Link> */}
              <Link 
                href="/" 
                className="w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancelar
              </Link>
              
              <Button type="submit" isLoading={status === 'submitting'} className="w-full">
                {isEditMode ? 'Guardar Cambios' : 'Publicar Receta'}
              </Button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
}