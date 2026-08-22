import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "alrvemtvosidnvekkvvc.supabase.co",
      },
    ],
  },
};

export default nextConfig;
