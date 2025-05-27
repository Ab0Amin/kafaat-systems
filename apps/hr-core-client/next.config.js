//@ts-check

const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  output: 'standalone',
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  // Enable subdomain routing
  async rewrites() {
    return {
      beforeFiles: [
        // Only allow login and set-password pages to be accessed directly
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<subdomain>.*)\\.localhost',
            },
          ],
          destination: '/:path*',
        },
      ],
    };
  },
  // Environment variables
  env: {
    BE_HOST: process.env.BE_HOST || 'localhost',
    BE_PORT: process.env.BE_PORT || '3000',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'default',
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
