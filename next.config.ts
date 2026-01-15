import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "**",
    }],
  },
}

export default nextConfig
