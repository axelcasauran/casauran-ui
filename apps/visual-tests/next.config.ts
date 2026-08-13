import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: [
    '@casauran-internal/accessibility',
    '@casauran/react',
    '@casauran/tokens',
    '@casauran/theme',
    '@casauran/icons',
  ],
};
export default config;
