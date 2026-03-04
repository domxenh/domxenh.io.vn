// app/robots.txt/route.ts
import { NextResponse } from "next/server"

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://domxenh.io.vn").replace(/\/$/, "")
}

export const runtime = "nodejs"

export function GET() {
  const base = siteUrl()

  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n")

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  })
}