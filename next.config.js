/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config
  },
  swcMinify: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  staticPageGenerationTimeout: 1000,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig
