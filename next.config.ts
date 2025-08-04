import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
// import { withSentryConfig } from '@sentry/nextjs';
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@heroicons/react',
      'framer-motion',
      'gsap'
    ]
  },
  turbopack: {
    resolveAlias: {
      // Optional: Add alias resolution for faster imports
      '@/*': './src/*'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '14voices.com',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'www.14voices.com',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: '14voices.fromjasp.com',
        pathname: '/api/media/**',
      },
    ],
  },
};

// Sentry configuration disabled temporarily
// const sentryWebpackPluginOptions = {
//   org: process.env.SENTRY_ORG,
//   project: process.env.SENTRY_PROJECT,
//   authToken: process.env.SENTRY_AUTH_TOKEN,
//   silent: process.env.NODE_ENV === 'production',
//   hideSourceMaps: true,
//   disableLogger: true,
//   telemetry: false, // Disable telemetry for now
// };

// Temporarily disable Sentry for build debugging
export default bundleAnalyzer(withPayload(nextConfig));
// export default bundleAnalyzer(withSentryConfig(withPayload(nextConfig), sentryWebpackPluginOptions));
