import React from 'react';

export const Button = ({ children, onClick, type = 'button', variant = 'primary', isLoading = false, className = '', ...props }) => {
  const baseClasses = "flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-xs text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out";
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    secondary: "bg-gray-400 text-gray-800 hover:bg-gray-500 focus:ring-gray-400",
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`${baseClasses} ${variants[variant]} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};