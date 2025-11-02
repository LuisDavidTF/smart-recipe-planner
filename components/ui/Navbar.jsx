// components/ui/Navbar.jsx
'use client' // Necesario porque usa el hook useAuth y es interactivo

import React from 'react';
import Link from 'next/link'; // 1. Importar Link
import { useRouter } from 'next/navigation'; // Importamos el router
import { useAuth } from '@context/AuthContext'; // Ajusta la ruta
import { LogInIcon, LogOutIcon, PlusIcon, UserIcon } from './Icons';

// 2. Quitamos la prop 'setView'
export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const router = useRouter(); // Inicializamos el router
  
  const getDisplayName = () => {
    // ... (tu función getDisplayName se queda igual)
    if (!user || !user.name) return '';
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0]} ${nameParts[nameParts.length - 1].charAt(0)}.`;
    }
    return nameParts[0]; 
  };
  
  const handleLogoClick = (e) => {
    e.preventDefault(); // Prevenimos la navegación por defecto del Link
    router.push('/');   // Navegamos a la página de inicio
    router.refresh();   // Forzamos la recarga de datos del servidor
  };
  
  return (
    <header className="bg-white shadow-xs sticky top-0 z-20">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 3. El logo ahora es un Link a la home '/' */}
          <Link href="/" onClick={handleLogoClick} className="shrink-0 flex items-center">
            <span className="text-2xl font-bold text-emerald-600">
              SmartRecipe
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Hola, {getDisplayName()}
                </span>
                
                {/* 4. 'Crear Receta' es un Link */}
                <Link
                  href="/create-recipe"
                  className="flex items-center text-sm font-medium px-3 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Crear Receta
                </Link>
                
                {/* 5. 'Logout' sigue siendo un botón, ¡esto es correcto! */}
                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                {/* 6. 'Acceder' es un Link */}
                <Link
                  href="/login"
                  className="flex items-center text-sm font-medium px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  <LogInIcon className="w-4 h-4 mr-2" />
                  Acceder
                </Link>
                
                {/* 7. 'Registrarse' es un Link */}
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