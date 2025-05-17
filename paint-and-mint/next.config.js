/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NEXT_PUBLIC_CSP_HEADER || "script-src 'self'; object-src 'self';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
