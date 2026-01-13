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
// SEO & Metadata Configuration
export const metadata = {
  title: "Smart Recipe Planner",
  description: "Planifica tus comidas de manera inteligente y eficiente.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RecipePlanner",
  },
  formatDetection: {
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export const viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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