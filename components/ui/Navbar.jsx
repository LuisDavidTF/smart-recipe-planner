'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Context
import { useAuth } from '@context/AuthContext';

// Icons
import { LogInIcon, LogOutIcon, PlusIcon, UserIcon } from './Icons';

// Simple Menu Icon for internal use
const MenuIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
    // Force a refresh to ensure the recipe feed is up to date when clicking logo
    router.refresh();
  };

  return (
    <header className="bg-white shadow-xs sticky top-0 z-50">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main Navigation"
      >
        <div className="flex justify-between items-center h-16">

          {/* Logo / Home Link */}
          <Link href="/" onClick={handleLogoClick} className="shrink-0 flex items-center gap-2">
            <span className="text-2xl font-bold text-emerald-600 tracking-tight">
              SmartRecipe
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-gray-700">
                  Hola, {getDisplayName()}
                </span>

                <Link
                  href="/create-recipe"
                  className="flex items-center text-sm font-medium px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                  aria-label="Crear nueva receta"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Crear Receta
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Salir
                </button>
              </>
            ) : (
              // Guest Users
              <>
                <Link
                  href="/login"
                  className="flex items-center text-sm font-medium px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogInIcon className="w-4 h-4 mr-2" />
                  Acceder
                </Link>

                <Link
                  href="/register"
                  className="flex items-center text-sm font-medium px-4 py-2 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="px-2 py-2 text-sm font-bold text-gray-900 border-b border-gray-50 mb-2">
                    Hola, {getDisplayName()}
                  </div>
                  <Link
                    href="/create-recipe"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-base font-medium px-3 py-2 rounded-md text-emerald-700 bg-emerald-50"
                  >
                    <PlusIcon className="w-5 h-5 mr-3" />
                    Crear Receta
                  </Link>

                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center w-full text-base font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <LogOutIcon className="w-5 h-5 mr-3" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-base font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-50"
                  >
                    <LogInIcon className="w-5 h-5 mr-3" />
                    Acceder
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center text-base font-medium px-3 py-2 rounded-md text-white bg-emerald-600"
                  >
                    <UserIcon className="w-5 h-5 mr-3" />
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}