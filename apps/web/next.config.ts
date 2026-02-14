import path from 'node:path'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: ['@adonis/react-layouts', '@adonis/react-ui'],
}

export default nextConfig
