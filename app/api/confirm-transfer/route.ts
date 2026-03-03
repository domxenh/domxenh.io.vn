// app/api/confirm-transfer/route.ts
/**
 * TÓM TẮT (VN):
 * - API nhận dữ liệu đơn hàng và gửi sang Google Apps Script (Google Sheet) qua webhook.
 * - CHỈNH FIX: Upstash REST dùng /pipeline (chuẩn) thay vì gọi /incr, /expire, /set (gây lỗi 400).
 * - Có:
 *   + Rate limit 2 lần / 60s / IP
 *   + Chống trùng theo (orderId + eventType) bằng SET NX EX
 * - Hỗ trợ eventType/paymentMethod/totalAmount.
 *
 * NƠI CHỈNH:
 * - Toàn bộ file.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type UpstashCfg = { url: string; token: string }

function bad(status: number, msg: string) {
  return new Response(msg, { status })
}

function stripQuotes(s: string) {
  const t = (s || "").trim()
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1).trim()
  }
  return t
}

function isValidUrl(u: string) {
  try {
    new URL(u)
    return true
  } catch {
    return false
  }
}

function pickWebhook() {
  const v1 = stripQuotes(process.env.GOOGLE_SHEETS_WEBHOOK_URL || "")
  const v2 = stripQuotes(process.env.GOOGLE_SHEETS_WEBHOOK || "")
  return (v1 || v2 || "").trim()
}

function getIp(req: Request) {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "unknown"
}

function normalizeItemsText(s: string) {
  const t = (s || "").trim()
  if (!t) return ""
  return t.length > 800 ? t.slice(0, 800) : t
}

function normalizeEventType(raw: string) {
  const t = (raw || "").trim()
  if (!t) return "order"
  if (t === "deposit_request") return "deposit_request"
  if (t === "deposit_confirm") return "deposit_confirm"
  if (t === "bank_confirm") return "bank_confirm"
  return "order"
}

function normalizePaymentMethod(raw: string) {
  const t = (raw || "").trim()
  if (t === "cod_deposit") return "cod_deposit"
  return "bank_transfer"
}

/** ===== Upstash (REST pipeline chuẩn) ===== */

function getUpstashCfg(): UpstashCfg | null {
  const url = stripQuotes(process.env.UPSTASH_REDIS_REST_URL || "")
  const token = stripQuotes(process.env.UPSTASH_REDIS_REST_TOKEN || "")
  if (!url || !token) return null
  if (!isValidUrl(url)) return null
  return { url, token }
}

type PipelineCmd = (string | number)[]

async function upstashPipeline(cfg: UpstashCfg, commands: PipelineCmd[]) {
  const endpoint = `${cfg.url}/pipeline`
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
  })

  if (!res.ok) {
    const t = await res.text().catch(() => "")
    throw new Error(`Upstash error: ${res.status}${t ? ` - ${t}` : ""}`)
  }

  return (await res.json()) as Array<{ result?: any; error?: string }>
}

/**
 * ✅ Rate limit: 2 req / 60s / IP
 */
const WINDOW_SEC = 60
const MAX_PER_WINDOW = 2

async function rateLimit(cfg: UpstashCfg, ip: string) {
  const key = `rl:cf:${ip}`

  // INCR key; nếu =1 thì EXPIRE key WINDOW_SEC
  const out = await upstashPipeline(cfg, [
    ["INCR", key],
    ["TTL", key],
  ])

  const count = Number(out?.[0]?.result || 0)
  const ttl = Number(out?.[1]?.result || -1)

  // TTL -1: chưa set expire -> set
  if (count === 1 || ttl < 0) {
    await upstashPipeline(cfg, [["EXPIRE", key, WINDOW_SEC]])
  }

  return count <= MAX_PER_WINDOW
}

/**
 * ✅ Chống trùng theo (orderId + eventType): SET key 1 NX EX 86400
 */
async function claimEvent(cfg: UpstashCfg, orderId: string, eventType: string) {
  const key = `order:${orderId}:${eventType}`

  const out = await upstashPipeline(cfg, [
    ["SET", key, "1", "NX", "EX", 86400],
  ])

  // SET NX -> trả "OK" nếu set được, null nếu đã tồn tại
  const r = out?.[0]?.result
  return r === "OK"
}

export async function POST(req: Request) {
  const webhook = pickWebhook()
  if (!webhook) return bad(500, "Thiếu GOOGLE_SHEETS_WEBHOOK_URL trong .env.local hoặc Vercel Env.")
  if (!isValidUrl(webhook)) return bad(500, "GOOGLE_SHEETS_WEBHOOK_URL không hợp lệ.")

  const raw = await req.text()
  if (raw.length > 20_000) return bad(413, "Dữ liệu gửi lên quá lớn.")

  let body: any
  try {
    body = JSON.parse(raw)
  } catch {
    return bad(400, "Dữ liệu không hợp lệ (JSON lỗi).")
  }

  const orderId = String(body?.orderId || "").trim()
  const amount = Number(body?.amount || 0)
  const totalAmount = Number(body?.totalAmount || 0)
  const eventType = normalizeEventType(String(body?.eventType || ""))
  const paymentMethod = normalizePaymentMethod(String(body?.paymentMethod || ""))

  const shipping = body?.shipping || {}
  const receiverName = String(shipping?.receiverName || "").trim()
  const phone = String(shipping?.phone || "").trim()
  const region = String(shipping?.region || "").trim()
  const street = String(shipping?.street || "").trim()

  const itemsText = normalizeItemsText(String(body?.itemsText || ""))

  if (!orderId || orderId.length < 8) return bad(400, "Thiếu mã đơn (orderId).")
  if (!Number.isFinite(amount) || amount <= 0) return bad(400, "Số tiền không hợp lệ.")
  if (Number.isFinite(totalAmount) && totalAmount > 200_000_000) return bad(400, "Tổng tiền không hợp lệ.")
  if (!itemsText) return bad(400, "Thiếu danh sách SKU (itemsText).")
  if (!receiverName || !phone || !region || !street) return bad(400, "Thiếu thông tin nhận hàng.")

  // ✅ Upstash chống spam + chống trùng
  const upstash = getUpstashCfg()
  if (upstash) {
    try {
      const ip = getIp(req)
      const okRl = await rateLimit(upstash, ip)
      if (!okRl) return bad(429, "Bạn thao tác quá nhanh. Vui lòng thử lại sau 1 phút.")

      const okEvent = await claimEvent(upstash, orderId, eventType)
      if (!okEvent) return bad(409, "Sự kiện này đã được ghi nhận trước đó.")
    } catch (e: any) {
      // ✅ Nếu Upstash lỗi, không làm chết flow: vẫn cho gửi sheet
      // (Bạn muốn chặt hơn thì đổi thành return bad(500, ...))
      // Ở đây ưu tiên không chặn khách mua.
      // eslint-disable-next-line no-console
      console.error("[upstash]", e?.message || e)
    }
  }

  const payload = {
    createdAt: new Date().toISOString(),
    eventType,
    paymentMethod,
    amount,
    totalAmount: Number.isFinite(totalAmount) && totalAmount > 0 ? totalAmount : undefined,
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
  if (!res.ok) return bad(res.status, text || "Không gửi được sang Google Sheet.")

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

// end code