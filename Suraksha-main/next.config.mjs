/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['img.etimg.com', 'htmbr.s3.ap-southeast-2.amazonaws.com'],
  },
  eslint: {
        ignoreDuringBuilds: true,
    },
}

export default nextConfig;