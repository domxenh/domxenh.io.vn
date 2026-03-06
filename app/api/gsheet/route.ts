// app/api/gsheet/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function bad(status: number, msg: string) {
  return new Response(msg, { status })
}

export async function POST(req: Request) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  const secret = process.env.GSHEET_SECRET

  if (!webhook) return bad(500, "Missing GOOGLE_SHEETS_WEBHOOK_URL")
  if (!secret) return bad(500, "Missing GSHEET_SECRET")

  // Chỉ cho server gọi (nếu muốn dùng): yêu cầu header secret
  const s = req.headers.get("x-domxenh-secret")
  if (s !== secret) return bad(401, "Unauthorized")

  const raw = await req.text()
  if (raw.length > 20_000) return bad(413, "Payload too large")

  let body: any
  try {
    body = JSON.parse(raw)
  } catch {
    return bad(400, "Invalid JSON")
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const text = await res.text().catch(() => "")
  return new Response(text || "OK", { status: res.status })
}