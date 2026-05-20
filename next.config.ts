import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Server configuration for Vercel */
  serverExternalPackages: ["mongoose", "bcryptjs", "jsonwebtoken", "multer"],

  /* Image domains for uploaded assets */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  /* Increase body size limit for uploads */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },


};

export default nextConfig;
