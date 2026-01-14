'use client';

import React from 'react';
import Link from 'next/link';
import { useSettings } from '@context/SettingsContext';

export default function NotFound() {
  const { t } = useSettings();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white dark:bg-gray-900 text-center transition-colors duration-300">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 drop-shadow-sm">
        {t.notFound?.title || '404'}
      </h2>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-lg">
        {t.notFound?.message || 'Lo sentimos, no pudimos encontrar la página que buscas.'}
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      >
        {t.notFound?.backHome || 'Volver al inicio'}
      </Link>
    </div>
  );
}