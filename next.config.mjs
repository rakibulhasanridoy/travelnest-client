/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com"  },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "i.ibb.co" },
    ],
  },
  async rewrites() {
    return [
      {
        source:      "/api/:path*",
        destination: `${process.env.API_SERVER_URL || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;