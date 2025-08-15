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
  // Enable standalone output for Docker deployment
  output: 'standalone',
  eslint: {
    // Disable ESLint during production builds to avoid dependency issues
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    'react-media-recorder',
    'extendable-media-recorder',
    'standardized-audio-context',
    'media-encoder-host',
    'recorder-audio-worklet',
  ],
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@heroicons/react',
      'framer-motion',
      'gsap',
    ],
    // Enable modern optimizations
    optimizeServerReact: true,
    // Disable ISR/SSG for self-hosted deployments
    isrMemoryCacheSize: 0,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  turbopack: {
    resolveAlias: {
      // Optional: Add alias resolution for faster imports
      '@/*': './src/*',
    },
  },
  webpack: (config, { webpack, isServer }) => {
    // Suppress OpenTelemetry and Sentry webpack warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve/,
    ];

    // Exclude test files from production builds
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /\.(test|spec)\.(ts|tsx|js|jsx)$/,
        })
      );

      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/test\//,
          contextRegExp: /src$/,
        })
      );

      // Bundle analysis and optimization
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            // Separate vendor chunks for better caching
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate audio/media processing libraries
            audio: {
              test: /[\\/]node_modules[\\/](standardized-audio-context|react-media-recorder)[\\/]/,
              name: 'audio-vendor',
              chunks: 'async',
              priority: 15,
            },
            // UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|framer-motion|lucide-react)[\\/]/,
              name: 'ui-vendor',
              chunks: 'all',
              priority: 12,
            },
          },
        },
      };
    }

    // Client-side optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };

      // Tree shake unused exports - disabled due to conflict with cacheUnaffected
      // config.optimization.usedExports = true;
      // config.optimization.sideEffects = false;
    }

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
        protocol: 'http',
        hostname: 'minio',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'minio.*',
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
    // Performance optimizations
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
