import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "xvohxedgjcriqklzmqlt.supabase.co",
      },
    ],
  },
};

export default nextConfig;
