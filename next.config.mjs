/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'plus.unsplash.com',
      'images.unsplash.com',
      'localhost',
      'res.cloudinary.com',
    ],
  },
  output: 'standalone',
};

export default nextConfig;
