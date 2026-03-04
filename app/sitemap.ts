// app/sitemap.ts
import type { MetadataRoute } from "next"
import { getProductsForSitemap } from "@/lib/products"

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://domxenh.io.vn").replace(/\/$/, "")
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/san-pham-full`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/lien-he`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/bao-hanh`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/thanh-toan`, changeFrequency: "yearly", priority: 0.3 },
  ]

  const products = await getProductsForSitemap()

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/san-pham/${p.slug}`,
    lastModified: p.createdAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}