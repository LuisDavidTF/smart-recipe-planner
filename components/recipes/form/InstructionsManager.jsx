import React from 'react';
import { TrashIcon } from '@components/ui/Icons';
import { Button } from '@components/ui/Button';

/**
 * Manages the rendering and interaction for the instructions list.
 * Expects a simple Array<String> data structure.
 */
export function InstructionsManager({ instructions, onChange, onAdd, onRemove, error }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Instrucciones
        </label>
        {error && (
          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 font-medium">
            {error}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {instructions.map((step, index) => (
          <div key={index} className="flex gap-3 items-start group">
            {/* Visual index is decoupled from data persistence (1-based for UI) */}
            <span className="mt-2.5 text-xs font-bold text-gray-400 w-12 text-right select-none">
              Paso {index + 1}
            </span>
            
            <div className="flex-grow relative">
              <textarea
                value={step}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder={`Describe el paso ${index + 1}...`}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none transition-all placeholder:text-gray-300"
              />
            </div>

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="mt-2 text-gray-300 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
              title="Eliminar paso"
              // Prevent removing the last item to ensure form usability
              disabled={instructions.length <= 1} 
              aria-disabled={instructions.length <= 1}
            >
              <TrashIcon className={`w-5 h-5 ${instructions.length <= 1 ? 'opacity-30' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      <Button 
        type="button" 
        variant="ghost" 
        onClick={onAdd} 
        className="text-emerald-600 hover:text-emerald-700 text-sm pl-0 hover:bg-transparent font-medium"
      >
        + Añadir siguiente paso
      </Button>
    </div>
  );
}