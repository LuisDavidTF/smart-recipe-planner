import React from 'react';
import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@context/AuthContext';
import { ToastProvider } from '@context/ToastContext';
import { SettingsProvider } from '@context/SettingsContext';
import { Navbar } from '@components/ui/Navbar';
import { Footer } from '@components/ui/Footer';
import { CookieConsent } from '@components/ui/CookieConsent';


// Performance: Load Inter font with swap strategy to ensure text visibility during load
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans', // This allows usage with Tailwind utility classes if configured
});

// SEO & Metadata Configuration
// SEO & Metadata Configuration
export const metadata = {
  title: {
    template: '%s | Culina Smart',
    default: 'Culina Smart - Planificador de Recetas Social',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://culinasmart.vercel.app'),
  description: "Planifica tus comidas de manera inteligente y eficiente.",
  manifest: "/manifest.json",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9F7F2" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1816" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const preferredRegion = 'iad1'; // Vercel Edge region preference

export default function RootLayout({ children, modal }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen font-sans antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {process.env.NEXT_PUBLIC_ENABLE_ADS === 'true' && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2928206942835905"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X50BSFS1NL"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-X50BSFS1NL');
          `}
        </Script>
        {/* 
          Providers Wrapper 
          Keeps state management context at the root level.
        */}
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />

                <main id="main-content" className="flex-grow">
                  {children}
                  {modal}
                </main>

                <Footer />
              </div>

              <CookieConsent />

              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "Culina Smart",
                    "applicationCategory": "LifestyleApplication",
                    "operatingSystem": "All",
                    "offers": {
                      "@type": "Offer",
                      "price": "0",
                      "priceCurrency": "USD"
                    }
                  }),
                }}
              />
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}