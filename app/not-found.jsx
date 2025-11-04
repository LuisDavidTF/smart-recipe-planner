import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center bg-white min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Página no Encontrada</h2>
      <p className="text-lg text-gray-700">
        Lo sentimos, no pudimos encontrar la página que buscas.</p>
      <Link href="/" className="mt-8 inline-block px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700">
        Volver al inicio
      </Link>
    </div>
  );
}