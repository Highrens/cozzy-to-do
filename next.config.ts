
/** @type {import('next').NextConfig} */
const nextConfig = {
  //basePath только для GitHub Pages
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/cozzy-to-do',
    assetPrefix: '/cozzy-to-do',
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
