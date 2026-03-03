// app/api/gsheet/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhook) {
    return new Response("Missing GOOGLE_SHEETS_WEBHOOK_URL", { status: 500 })
  }

  let body: any = null
  try {
    body = await req.json()
  } catch {
    return new Response("Invalid JSON body", { status: 400 })
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const text = await res.text().catch(() => "")
  return new Response(text || "OK", { status: res.status })
}

// (tuỳ chọn) để tránh lỗi preflight nếu sau này bạn gọi từ domain khác
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}