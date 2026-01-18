import type { NextConfig } from "next";
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false, // Enable in Dev to test Offline functionality
  skipWaiting: true, // Auto-Update: install new SW immediately
  register: true,
  fallbacks: {
    document: "/~offline",
  },
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      // 1. App Pages (Navigation) - StaleWhileRevalidate for INSTANT load (Cache First feel, update in background)
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 200,
          },
          networkTimeoutSeconds: 3,
        },
      },
      // 2. Static Resources (JS, CSS, Fonts) - CacheFirst for performance
      {
        urlPattern: /\.(?:js|css|woff2?|eot|ttf|otf)$/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-assets',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 * 365, // 1 year
          },
        },
      },
      // 3. API - Recipes Feed (StaleWhileRevalidate)
      {
        urlPattern: /^https?.+\/api\/recipes.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-recipes-feed',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
          networkTimeoutSeconds: 5,
        },
      },
      // 4. API - Others (NetworkFirst)
      {
        urlPattern: /^https?.+\/api\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-others',
          expiration: {
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60, // 24 hours
          },
          networkTimeoutSeconds: 3,
        },
      },
      // 5. Images (CacheFirst)
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Disable the X-Powered-By header for security (hide technology stack)
  poweredByHeader: false,

  // Silence Turbopack/Webpack conflict error
  // @ts-ignore
  turbopack: {},


  // Enable compression for smaller payload sizes (default is true, explicit is better)
  compress: true,

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // User provided images (allow any for now but unoptimized to prevent build errors if config missing)
      // Ideally, you should restrict this to your specific S3 bucket or CDN.
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },

  // Security Headers for Production/Vercel
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },
};

export default withPWA(nextConfig);
