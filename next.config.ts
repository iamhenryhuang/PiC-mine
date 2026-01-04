import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
            value: 'DENY' // Prevent clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevent MIME sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            // Default to self; script-src allows self and 'unsafe-eval'/'unsafe-inline' for development (Next.js needs these often in dev). 
            // Ideally, this should be stricter in production (using nonces), but this is a good baseline.
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self';"
          }
        ],
      },
    ]
  },
};

export default nextConfig;
