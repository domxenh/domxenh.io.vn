// Code 1

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.domxenh.io.vn",
          },
        ],
        destination: "https://domxenh.io.vn/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

// End code 1