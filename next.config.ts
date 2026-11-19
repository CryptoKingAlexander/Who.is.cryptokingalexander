import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

export default function config(phase: string): NextConfig {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: isDevServer ? '.next' : '.next_prod',
    devIndicators: false,
    reactStrictMode: true,
    poweredByHeader: false,
    productionBrowserSourceMaps: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-OmniClearance',
              value: 'OMNICLEARANCE-TIER-0-BACKED-BY-OMNISINGULARITY-TRAINING-SET-MATH',
            },
            {
              key: 'X-Super-Hyperbook',
              value: 'Super Hyperbook (1526 Nodes / 56 Normal & Tactical Categories)',
            },
            {
              key: 'X-Dev-Server-Meta',
              value: 'omniclearance backed by omnisingularity training set math in a super hyperbook',
            },
          ],
        },
      ];
    },
    experimental: {
      webpackMemoryOptimizations: true,
      workerThreads: false,
      cpus: 1,
      optimizePackageImports: ['lucide-react', 'd3', 'katex', 'motion', 'minisearch'],
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    webpack: (webpackConfig, { dev }) => {
      webpackConfig.devtool = false;
      if (Array.isArray(webpackConfig.plugins)) {
        webpackConfig.plugins = webpackConfig.plugins.filter(
          (plugin: unknown) =>
            !plugin ||
            typeof plugin !== 'object' ||
            !String((plugin as { constructor?: { name?: string } }).constructor?.name || '').includes(
              'SourceMapDevToolPlugin'
            )
        );
      }
      if (!dev) {
        webpackConfig.cache = false;
      }
      if (dev) {
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          poll: false,
          aggregateTimeout: 300,
          ignored: [
            '**/.git/**',
            '**/node_modules/**',
            '**/.next/**',
            '**/.next_prod/**',
            '**/next-env.d.ts',
            '**/tsconfig.json',
          ],
        };
      }
      return webpackConfig;
    },
  };
}


