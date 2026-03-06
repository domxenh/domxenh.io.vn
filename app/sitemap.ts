// app/sitemap.ts
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://domxenh.io.vn"
  const now = new Date()

  // Các trang quan trọng (bạn có thể thêm/bớt)
  const routes = [
    "/",
    "/san-pham-full",
    "/lien-he",
    "/bao-hanh",
  ]

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }))
}