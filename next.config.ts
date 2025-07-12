
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Автоматически определяем, если это GitHub Pages
  ...(process.env.GITHUB_ACTIONS && {
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