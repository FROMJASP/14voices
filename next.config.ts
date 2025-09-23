import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';

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
  output: 'standalone', // Enable standalone output for Docker
  eslint: {
    // Disable ESLint during production builds to avoid dependency issues
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@payloadcms/ui',
    '@payloadcms/richtext-lexical',
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
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-accordion',
      '@radix-ui/react-tabs',
      'clsx',
      'class-variance-authority',
      'tailwind-merge',
    ],
    // Enable modern optimizations
    optimizeServerReact: true,
    // Enable modern JavaScript optimizations
    reactCompiler: false, // Keep disabled for React 19 stability
    // Enable partial prerendering for better performance
    ppr: false, // Only available in Next.js canary versions
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false, // Remove X-Powered-By header
  generateEtags: true, // Enable ETag generation
  // Optimized headers for performance
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
    {
      source: '/uploads/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=300, s-maxage=600',
        },
      ],
    },
  ],
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

      // Basic optimization without complex chunk splitting to avoid conflicts
      // Note: Advanced chunk splitting can be enabled after stability is ensured
      config.optimization = {
        ...config.optimization,
        // Keep default Next.js chunk splitting for now
        // splitChunks can be customized later once build is stable
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
        hostname: '14voices.fromjasp.com',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.iam-studios.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'minio-*.sslip.io',
        pathname: '/**',
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
    // Add quality configurations for Next.js 16 compatibility
    qualities: [85, 100],
  },
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true, // Always silent to avoid build noise
  hideSourceMaps: true,
  disableLogger: true,
  telemetry: false, // Disable telemetry
  // Only enable in production
  disabled: process.env.NODE_ENV !== 'production',
};

// Export with Sentry only in production
export default process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN
  ? withBundleAnalyzer(withSentryConfig(withPayload(nextConfig), sentryWebpackPluginOptions))
  : withBundleAnalyzer(withPayload(nextConfig));
