import React from 'react';
import './globals.css'; 
import { AuthProvider } from '@context/AuthContext'; 
import { ToastProvider } from '@context/ToastContext';
import { Navbar } from '@components/ui/Navbar';

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
            <div className="min-h-screen bg-gray-50 font-sans antialiased">
              
              <Navbar /> 
              
              <main>
                {children} 
                {modal}
              </main>

              <footer className="mt-16 pb-8 text-center">
                <p className="text-gray-500 text-sm">
                  &copy; {new Date().getFullYear()} SmartRecipe.
                </p>
              </footer>
            </div>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}