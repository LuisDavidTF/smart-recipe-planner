import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable the X-Powered-By header for security (hide technology stack)
  poweredByHeader: false,

  // Enable compression for smaller payload sizes (default is true, explicit is better)
  compress: true,

  // Image optimization configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    // Add domains here if you use external images immediately
    // domains: ['example.com'], 
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

export default nextConfig;
