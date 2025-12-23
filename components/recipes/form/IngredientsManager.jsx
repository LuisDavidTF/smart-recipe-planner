import React from 'react';
import { TrashIcon } from '@components/ui/Icons';
import { Button } from '@components/ui/Button';

export function IngredientsManager({ ingredients, onChange, onAdd, onRemove, error }) {
  return (
    <div className="space-y-4">
       <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Ingredientes
        </label>
        {error && (
          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 font-medium">
            {error}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {ingredients.map((ing, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-start">
            {/* Ingredient Name */}
            <div className="col-span-5">
              <input
                type="text"
                placeholder="Ingrediente (ej: Harina)"
                value={ing.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
            </div>
            {/* Quantity */}
            <div className="col-span-3">
              <input
                type="text" 
                placeholder="Cant."
                value={ing.quantity}
                onChange={(e) => onChange(index, 'quantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
            </div>
            {/* Unit */}
            <div className="col-span-3">
              <input
                type="text"
                placeholder="Unidad"
                value={ing.unit_of_measure}
                onChange={(e) => onChange(index, 'unit_of_measure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              />
            </div>
            {/* Actions */}
            <div className="col-span-1 flex justify-center pt-2">
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
                disabled={ingredients.length <= 1}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={onAdd}
        className="text-emerald-600 hover:text-emerald-700 text-sm pl-0 hover:bg-transparent font-medium"
      >
        + Añadir ingrediente
      </Button>
    </div>
  );
}