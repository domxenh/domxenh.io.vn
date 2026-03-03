// proxy.ts
import { NextResponse, type NextRequest } from "next/server"

function getCountry(req: NextRequest) {
  // Vercel header (ổn định nhất khi deploy)
  const c =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country") ||
    ""
  return c.toUpperCase()
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // chỉ chặn api nhạy cảm
  const isProtected =
    pathname.startsWith("/api/confirm-transfer") ||
    pathname.startsWith("/api/gsheet")

  if (!isProtected) return NextResponse.next()

  // dev/local cho qua
  const host = req.headers.get("host") || ""
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return NextResponse.next()
  }

  const country = getCountry(req)

  // nếu detect được country và không phải VN -> chặn
  if (country && country !== "VN") {
    return new NextResponse("Forbidden (VN only)", { status: 403 })
  }

  // nếu không detect được country (hiếm) -> cho qua để tránh chặn nhầm
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/confirm-transfer/:path*", "/api/gsheet/:path*"],
}