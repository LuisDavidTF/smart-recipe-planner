import React from 'react';
import { SkeletonCard } from './SkeletonCard';

export const LoadingState = ({ showSlowLoadMessage }) => (
  <>
    {showSlowLoadMessage && (
      <div className="mb-6 p-4 bg-sky-50 text-sky-800 rounded-lg text-center shadow-xs">
        <p>¡Hola! Estamos despertando el servidor. Esto puede tardar un momento...</p>
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (<SkeletonCard key={i} />))}
    </div>
  </>
);