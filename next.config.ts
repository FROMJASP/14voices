import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
// import { withSentryConfig } from '@sentry/nextjs';

// Bundle analyzer configuration - only loads in development
const withBundleAnalyzer = (config: NextConfig): NextConfig => {
  if (process.env.NODE_ENV === 'development' && process.env.ANALYZE === 'true') {
    try {
      // Use dynamic import to avoid build errors
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const analyzer = require('@next/bundle-analyzer');
      return analyzer({ enabled: true })(config);
    } catch {
      console.warn('Bundle analyzer not available');
    }
  }
  return config;
};

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds to avoid dependency issues
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@heroicons/react',
      'framer-motion',
      'gsap',
    ],
  },
  turbopack: {
    resolveAlias: {
      // Optional: Add alias resolution for faster imports
      '@/*': './src/*',
    },
  },
  webpack: (config) => {
    // Suppress OpenTelemetry and Sentry webpack warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve/,
    ];

    return config;
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
export default withBundleAnalyzer(withPayload(nextConfig));
// export default withBundleAnalyzer(withSentryConfig(withPayload(nextConfig), sentryWebpackPluginOptions));
