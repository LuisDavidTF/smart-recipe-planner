'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Context
import { useAuth } from '@context/AuthContext';

// Icons
import { LogInIcon, LogOutIcon, PlusIcon, UserIcon } from './Icons';

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();

  // Format user name for display (First Name + Last Initial)
  const getDisplayName = () => {
    if (!user || !user.name) return '';
    const nameParts = user.name.split(' ');
    // If we have more than one name, take the first and the initial of the last
    if (nameParts.length > 1) {
      return `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`;
    }
    return nameParts[0];
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    router.push('/');
    // Force a refresh to ensure the recipe feed is up to date when clicking logo
    router.refresh();
  };

  return (
    <header className="bg-white shadow-xs sticky top-0 z-20">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main Navigation"
      >
        <div className="flex justify-between items-center h-16">

          {/* Logo / Home Link */}
          <Link href="/" onClick={handleLogoClick} className="shrink-0 flex items-center">
            <span className="text-2xl font-bold text-emerald-600">
              SmartRecipe
            </span>
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Hola, {getDisplayName()}
                </span>

                <Link
                  href="/create-recipe"
                  className="flex items-center text-sm font-medium px-3 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                  aria-label="Crear nueva receta"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Crear Receta
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                  aria-label="Cerrar sesión"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              // Guest Users
              <>
                <Link
                  href="/login"
                  className="flex items-center text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <LogInIcon className="w-4 h-4 mr-2" />
                  Acceder
                </Link>

                <Link
                  href="/register"
                  className="flex items-center text-sm font-medium px-3 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}