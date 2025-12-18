import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: false,
  // Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
