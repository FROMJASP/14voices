import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  // Turbopack is stable, no longer experimental
  experimental: {
    reactCompiler: false
  },
};

export default withPayload(nextConfig);
