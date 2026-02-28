// next.config.ts
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/san-pham",
        destination: "/san-pham-full",
        permanent: true,
      },
    ]
  },

  images: {
    qualities: [50, 60, 70, 75, 80, 85, 90, 95, 100],
  },
}

export default nextConfig

// end code