/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    WS_URL: process.env.WS_URL || 'ws://localhost:4000',
    API_URL: process.env.API_URL || 'http://localhost:4000/api',
  },
}

module.exports = nextConfig


