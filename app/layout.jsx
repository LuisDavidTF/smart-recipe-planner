// app/layout.jsx
import React from 'react';
import './globals.css'; 
import { AuthProvider } from '@context/AuthContext'; 
import { ToastProvider } from '@context/ToastContext';
import { Navbar } from '@components/ui/Navbar'; // <-- 1. Importa tu Navbar

export const metadata = {
  title: 'Mis Recetas',
  description: 'Descubre recetas increíbles',
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <ToastProvider>
            {/* 2. Añade el div principal que tenías */}
            <div className="min-h-screen bg-gray-50 font-sans antialiased">
              
              {/* 3. Renderiza el Navbar aquí */}
              <Navbar /> 
              
              <main>
                {/* 4. Tus páginas y modales se renderizan aquí */}
                {children} 
                {modal}
              </main>

              {/* 5. Añade tu Footer aquí */}
              <footer className="mt-16 pb-8 text-center">
                <p className="text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} SmartRecipe. Todos los derechos reservados.
                </p>
              </footer>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}