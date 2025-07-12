/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  basePath: '/cozzy-to-do/',
  assetPrefix: '/cozzy-to-do/',

}

module.exports = nextConfig