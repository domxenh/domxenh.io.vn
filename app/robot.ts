// app/robots.ts
import type { MetadataRoute } from "next"

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://domxenh.io.vn").replace(/\/$/, "")
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  }
}