
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Применяем basePath только для GitHub Pages
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/your-repo-name',
    assetPrefix: '/your-repo-name/',
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
