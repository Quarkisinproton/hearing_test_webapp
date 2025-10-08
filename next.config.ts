import type {NextConfig} from 'next';
import withPWA from '@ducanh2912/next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: false, // disable automatic client registration to avoid conflicts with custom sw.js
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // only disable in development
});

export default pwaConfig(nextConfig);
