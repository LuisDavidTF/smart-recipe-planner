'use client'

import React, { useState } from 'react';
import { SparklesIcon } from '@components/ui/Icons'; 
import { Button } from '@components/ui/Button';

/**
 * Handles AI-powered recipe draft generation.
 * Acts as an adapter between the unstable AI output and the strict Form Schema.
 */
export function MagicGenerator({ onDraftGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error al generar la receta.');
      }

      const rawDraft = await res.json();

      // --- ADAPTER LAYER ---
      // Normalizes AI response to ensure compatibility with the new List<String> schema.
      // Handles legacy Object format {"1": "Val"} and new Array format ["Val"].
      let normalizedInstructions = [''];

      if (Array.isArray(rawDraft.instructions)) {
        normalizedInstructions = rawDraft.instructions.length > 0 
            ? rawDraft.instructions 
            : [''];
      } else if (typeof rawDraft.instructions === 'object' && rawDraft.instructions !== null) {
        normalizedInstructions = Object.values(rawDraft.instructions);
      }

      // Sanitize payload before injecting into the form state
      const sanitizedDraft = {
        name: rawDraft.name || '',
        description: rawDraft.description || '',
        preparationTime: rawDraft.preparationTime || '', 
        // Use a generic placeholder if AI fails to provide a valid image URL
        imageUrl: rawDraft.image_url || 'https://placehold.co/600x400/e2e8f0/475569?text=AI+Generated',
        ingredients: Array.isArray(rawDraft.ingredients) ? rawDraft.ingredients : [],
        instructions: normalizedInstructions,
        type: rawDraft.type || 'lunch',
      };

      onDraftGenerated(sanitizedDraft);
      
    } catch (err) {
      console.error('[MagicGenerator] Generation failed:', err);
      setError(err.message || "No se pudo generar el borrador. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="relative p-5 border border-emerald-200 rounded-xl bg-emerald-50/50 shadow-sm transition-all hover:shadow-md">
      
      {/* Loading Overlay: Prevents interaction during async operation */}
      {isGenerating && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl transition-all">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-3"></div>
          <span className="text-sm font-semibold text-emerald-800 animate-pulse">
            Generando borrador inteligente...
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
            <SparklesIcon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-emerald-900">
            Generación Mágica
        </h3>
      </div>

      <p className="text-sm text-emerald-800/80 mb-4 leading-relaxed">
        Describe tu idea (ej: "<em>Desayuno saludable con avena</em>") y la IA completará los campos por ti.
      </p>

      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Pasta cremosa con champiñones para una cena rápida..."
          rows={2}
          disabled={isGenerating}
          className="w-full px-4 py-3 border border-emerald-200 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white placeholder:text-gray-400 resize-none"
        />

        {error && (
            <div className="text-xs text-red-600 font-medium pl-1 animate-in fade-in slide-in-from-top-1">
                {error}
            </div>
        )}

        <div className="flex justify-end">
            <Button
                type="button"
                onClick={handleGenerate}
                isLoading={isGenerating}
                disabled={isGenerating || !prompt.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 text-xs px-5"
            >
                <SparklesIcon className="w-4 h-4 mr-2" />
                Generar Borrador
            </Button>
        </div>
      </div>
    </div>
  );
}