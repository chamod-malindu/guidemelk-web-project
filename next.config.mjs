/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Covers all Google image subdomains
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // If you add GitHub login later
      },
    ],
  },
};

export default nextConfig;