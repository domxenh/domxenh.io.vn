// app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const base = "https://domxenh.io.vn"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}