// next.config.ts
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/san-pham",
        destination: "/san-pham-full",
        permanent: true,
      },
    ]
  },
}

export default nextConfig