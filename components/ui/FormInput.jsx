import React from 'react';

export const FormInput = ({ id, label, type = 'text', value, onChange, error, ...props }) => {
  const errorClasses = error ? 'border-red-500 ring-red-500' : 'border-gray-300 focus:ring-emerald-500';
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-lg shadow-xs focus:outline-none focus:ring-2 ${errorClasses}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};