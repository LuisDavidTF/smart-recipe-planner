import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApiClient } from '@hooks/useApiClient';
import { useAuth } from '@context/AuthContext';
import { useToast } from '@context/ToastContext';

const INITIAL_STATE = {
  name: '',
  description: '',
  preparationTime: '',
  imageUrl: '',
  ingredients: [{ name: '', quantity: '', unit_of_measure: '' }],
  instructions: [''], // Default to Array<String>
  type: 'lunch',
  visibility: 'public',
};

export function useRecipeForm(recipeId) {
  const router = useRouter();
  const api = useApiClient();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isEditMode = !!recipeId;

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [status, setStatus] = useState(isEditMode ? 'loading' : 'idle');
  const [apiError, setApiError] = useState(null);
  const [errors, setErrors] = useState({});

  /**
   * Data Fetching & Normalization Strategy
   * Handles migration from Object-based instructions to Array-based instructions.
   */
  useEffect(() => {
    if (!isEditMode) return;

    let isMounted = true;

    api.getRecipeById(recipeId)
      .then(recipe => {
        if (!isMounted) return;

        // --- SECURITY CHECK: Ownership Verification ---
        // If user is logged in, ensure they own the recipe before letting them see the edit form.
        // Falls back safely if user object isn't fully ready yet, but typically AuthContext loads first.
        if (user && recipe.user && recipe.user.id !== user.id) {
          showToast('No tienes permiso para editar esta receta.', 'error');
          router.push('/');
          return;
        }

        // Legacy Support: Normalize 'instructions' to Array if backend returns Object
        let normalizedInstructions = [''];
        if (Array.isArray(recipe.instructions)) {
          normalizedInstructions = recipe.instructions.length > 0 ? recipe.instructions : [''];
        } else if (recipe.instructions && typeof recipe.instructions === 'object') {
          // Object.values guarantees array structure from legacy map
          normalizedInstructions = Object.values(recipe.instructions);
        }

        setFormData({
          name: recipe.name || '',
          description: recipe.description || '',
          preparationTime: recipe.preparation_time_minutes || '',
          imageUrl: recipe.image_url || '',
          ingredients: recipe.ingredients?.map(ing => ({
            name: ing.ingredient.name || '',
            quantity: ing.quantity || '',
            unit_of_measure: ing.unit_of_measure || '',
          })) || [{ name: '', quantity: '', unit_of_measure: '' }],
          instructions: normalizedInstructions,
          type: recipe.type || 'lunch',
          visibility: recipe.visibility || 'public',
        });
        setStatus('idle');
      })
      .catch(err => {
        if (!isMounted) return;
        console.error('[RecipeForm] Fetch Error:', err);
        setApiError(err.message || 'Error al cargar la receta.');
        setStatus('error');
      });

    return () => { isMounted = false; };
  }, [recipeId, api, isEditMode]);

  // --- Field Handlers ---

  const setFieldValue = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }, [errors]);

  const handleIngredientChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newIngs = [...prev.ingredients];
      newIngs[index] = { ...newIngs[index], [field]: value };
      return { ...prev, ingredients: newIngs };
    });
    if (errors.ingredientsRoot) setErrors(prev => ({ ...prev, ingredientsRoot: undefined }));
  }, [errors]);

  const handleInstructionChange = useCallback((index, value) => {
    setFormData(prev => {
      const newInst = [...prev.instructions];
      newInst[index] = value;
      return { ...prev, instructions: newInst };
    });
    if (errors.instructionsRoot) setErrors(prev => ({ ...prev, instructionsRoot: undefined }));
  }, [errors]);

  const modifyList = useCallback((listName, action, index) => {
    setFormData(prev => {
      const list = [...prev[listName]];
      if (action === 'add') {
        const item = listName === 'ingredients'
          ? { name: '', quantity: '', unit_of_measure: '' }
          : '';
        list.push(item);
      } else if (action === 'remove') {
        if (list.length > 1) list.splice(index, 1);
      }
      return { ...prev, [listName]: list };
    });
  }, []);

  const handleDraftLoaded = (draftData) => {
    setFormData(prev => ({
      ...prev,
      ...draftData,
      // Ensure strictly array format from AI response
      instructions: Array.isArray(draftData.instructions) ? draftData.instructions : ['']
    }));
  };

  // --- Validation & Submission ---

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim() || formData.name.length < 3) newErrors.name = 'Mínimo 3 caracteres.';
    if (!formData.description?.trim()) newErrors.description = 'Descripción requerida.';
    if (!formData.preparationTime || isNaN(Number(formData.preparationTime))) newErrors.preparationTime = 'Tiempo inválido.';
    if (!formData.imageUrl?.trim()) newErrors.imageUrl = 'URL de imagen requerida.';

    // Validate Instructions (Array<String>)
    const validInstructions = formData.instructions.filter(i => i.trim().length >= 5);
    if (validInstructions.length === 0) {
      newErrors.instructionsRoot = 'Al menos una instrucción válida (min 5 letras).';
    }

    // Validate Ingredients
    const validIngredients = formData.ingredients.filter(i => i.name.trim() && i.unit_of_measure.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredientsRoot = 'Al menos un ingrediente válido.';
    }

    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');

    // Payload Sanitization
    const payload = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      visibility: formData.visibility,
      preparation_time_minutes: parseInt(formData.preparationTime, 10),
      image_url: formData.imageUrl.trim(),

      ingredients: formData.ingredients
        .filter(i => i.name.trim())
        .map(i => ({
          name: i.name.trim(),
          unit_of_measure: i.unit_of_measure.trim(),
          quantity: i.quantity ? parseFloat(i.quantity) : undefined
        })),

      // STRICT ARRAY SUBMISSION:
      // Sends ["Step 1", "Step 2"] directly to backend. 
      instructions: formData.instructions
        .map(s => s.trim())
        .filter(s => s.length > 0)
    };

    try {
      if (isEditMode) {
        await api.updateRecipe(recipeId, payload);
        showToast('Receta actualizada', 'success');
      } else {
        await api.createRecipe(payload);
        showToast('Receta creada', 'success');
      }
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setApiError(err.message || 'Error al procesar la solicitud.');
      setStatus('idle');
    }
  };

  return {
    formData,
    status,
    errors,
    apiError,
    handlers: {
      setFieldValue,
      handleIngredientChange,
      handleInstructionChange,
      modifyList,
      handleDraftLoaded,
      submit,
      retry: () => window.location.reload()
    }
  };
}