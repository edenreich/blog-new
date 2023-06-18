/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
