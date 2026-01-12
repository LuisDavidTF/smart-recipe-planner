import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@context/AuthContext';
import { ToastProvider } from '@context/ToastContext';
import { Navbar } from '@components/ui/Navbar';

// Performance: Load Inter font with swap strategy to ensure text visibility during load
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans', // This allows usage with Tailwind utility classes if configured
});

// SEO & Metadata Configuration
export const metadata = {
  title: {
    template: '%s | Smart Recipe Planner',
    default: 'Smart Recipe Planner', // Fallback title
  },
  description: 'Descubre, crea y organiza tus recetas favoritas de manera inteligente.',
  keywords: ['recetas', 'cocina', 'planificador', 'smart recipe', 'comida'],
  authors: [{ name: 'SmartRecipe Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
  },
};

export const preferredRegion = 'iad1'; // Vercel Edge region preference

export default function RootLayout({ children, modal }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {/* 
          Providers Wrapper 
          Keeps state management context at the root level.
        */}
        <AuthProvider>
          <ToastProvider>

            <Navbar />

            <main id="main-content" className="flex-grow">
              {children}
              {modal}
            </main>

            <footer className="mt-16 pb-8 text-center" role="contentinfo">
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} SmartRecipe. Todos los derechos reservados.
              </p>
            </footer>

          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}