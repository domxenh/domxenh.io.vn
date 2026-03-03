// app/api/confirm-transfer/route.ts
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type UpstashCfg = { url: string; token: string }

function getIp(req: Request) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "unknown"
}

function bad(status: number, msg: string) {
  return new Response(msg, { status })
}

function getUpstash(): UpstashCfg | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url, token }
}

async function upstashFetch(cfg: UpstashCfg, path: string) {
  const res = await fetch(`${cfg.url}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.token}` },
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`Upstash error: ${res.status}`)
  return res.json() as Promise<any>
}

/**
 * ✅ Rate limit: 2 req / 60s / IP
 */
const WINDOW_SEC = 60
const MAX_PER_WINDOW = 2

async function rateLimit(cfg: UpstashCfg, ip: string) {
  const key = `rl:cf:${ip}`
  const r1 = await upstashFetch(cfg, `/incr/${encodeURIComponent(key)}`)
  const count = Number(r1?.result || 0)

  // set expire chỉ khi lần đầu trong window
  if (count === 1) {
    await upstashFetch(cfg, `/expire/${encodeURIComponent(key)}/${WINDOW_SEC}`)
  }

  return count <= MAX_PER_WINDOW
}

// Idempotency: mỗi orderId chỉ ghi 1 lần (TTL 1 ngày)
async function claimOrder(cfg: UpstashCfg, orderId: string) {
  const key = `order:${orderId}`
  const r = await upstashFetch(cfg, `/set/${encodeURIComponent(key)}/1?nx=true&ex=86400`)
  return Boolean(r?.result)
}

function normalizeItemsText(s: string) {
  const t = (s || "").trim()
  if (!t) return ""
  return t.length > 400 ? t.slice(0, 400) : t
}

export async function POST(req: Request) {
  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhook) return bad(500, "Missing GOOGLE_SHEETS_WEBHOOK_URL")

  const upstash = getUpstash()
  if (!upstash) return bad(500, "Missing Upstash env")

  const raw = await req.text()
  if (raw.length > 20_000) return bad(413, "Payload too large")

  let body: any
  try {
    body = JSON.parse(raw)
  } catch {
    return bad(400, "Invalid JSON")
  }

  const orderId = String(body?.orderId || "").trim()
  const amount = Number(body?.amount || 0)

  const shipping = body?.shipping || {}
  const receiverName = String(shipping?.receiverName || "").trim()
  const phone = String(shipping?.phone || "").trim()
  const region = String(shipping?.region || "").trim()
  const street = String(shipping?.street || "").trim()

  const itemsText = normalizeItemsText(String(body?.itemsText || ""))

  if (!orderId || orderId.length < 8) return bad(400, "Missing orderId")
  if (!Number.isFinite(amount) || amount <= 0 || amount > 200_000_000) return bad(400, "Bad amount")
  if (!itemsText) return bad(400, "Missing itemsText")
  if (!receiverName || !phone || !region || !street) return bad(400, "Missing shipping info")

  // ✅ Rate limit theo IP: tối đa 2 lần/phút
  const ip = getIp(req)
  const okRl = await rateLimit(upstash, ip)
  if (!okRl) return bad(429, "Too many requests")

  // ✅ Chống trùng order
  const okOrder = await claimOrder(upstash, orderId)
  if (!okOrder) return bad(409, "Duplicate order")

  const payload = {
    createdAt: new Date().toISOString(),
    paymentMethod: "bank_transfer",
    amount,
    shipping: { receiverName, phone, region, street },
    itemsText,
    orderId,
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const text = await res.text().catch(() => "")
  if (!res.ok) return bad(res.status, text || "Webhook error")

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}