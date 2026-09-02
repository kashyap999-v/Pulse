/** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        {
          protocol:'https',
          hostname: '**.amazonaws.com',
        },
      ],
    },
  };

  module.exports = nextConfig;
