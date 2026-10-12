/** @type {import('next').NextConfig} */

// next.config.js
import withPWA from 'next-pwa';

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  disable: process.env.NODE_ENV !== 'production',
  dest: 'public',
  register: true,
  // Authenticated API responses must not survive logout in service-worker caches.
  runtimeCaching: [],
  skipWaiting: true,
})(nextConfig);
