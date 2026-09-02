/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
};

const nextConfig = {
    ...existing config,
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;
