import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "placehold.co",
      "files.edgestore.dev",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "unsplash.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
