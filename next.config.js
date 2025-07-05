/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  // 其他配置...
  allowedDevOrigins: ['192.168.31.173'], // 允许的开发源
};

module.exports = nextConfig;
