// app/checkout/CheckoutClient.tsx
"use client"

import { useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import VietQR from "@/components/VietQR"
import { getCart } from "@/components/cart/cartStore"

const SHIPPING_KEY = "domxenh_checkout_shipping_v1"

function toInt(v: string | null) {
  if (!v) return 0
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? Math.max(0, n) : 0
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function buildItemsText() {
  const cart = getCart()
  // gộp theo skuCode để chắc chắn không bị trùng key
  const map = new Map<string, number>()
  for (const it of cart) {
    const sku = (it.skuCode || "").trim()
    if (!sku) continue
    map.set(sku, (map.get(sku) || 0) + (it.qty || 1))
  }
  if (map.size === 0) return ""

  return Array.from(map.entries())
    .map(([sku, qty]) => `${sku} x${qty}`)
    .join(" | ")
}

export default function CheckoutClient() {
  const sp = useSearchParams()
  const router = useRouter()

  const amount = useMemo(() => toInt(sp.get("amount")), [sp])

  const [isSending, setIsSending] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [sendError, setSendError] = useState<string>("")

  async function sendToGoogleSheet() {
    setSendError("")
    setIsSending(true)

    const shipping =
      safeJsonParse<{
        receiverName?: string
        phone?: string
        region?: string
        street?: string
      }>(localStorage.getItem(SHIPPING_KEY)) || {}

    const itemsText = buildItemsText()

    const payload = {
      createdAt: new Date().toISOString(),
      paymentMethod: "bank_transfer",
      amount,
      shipping: {
        receiverName: shipping.receiverName || "",
        phone: shipping.phone || "",
        region: shipping.region || "",
        street: shipping.street || "",
      },
      itemsText, // ✅ chuỗi dễ đọc
    }

    try {
      const res = await fetch("/api/gsheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(txt || "Gửi dữ liệu thất bại")
      }

      setShowThanks(true)
    } catch (e: any) {
      setSendError(e?.message || "Gửi dữ liệu thất bại")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-28">
      <div className="grid place-items-center text-center gap-3">
        <h1 className="text-[34px] font-extrabold text-[#FFD66B] drop-shadow-[0_0_14px_rgba(255,214,107,0.35)]">
          Thanh toán chuyển khoản (VietQR)
        </h1>

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-5 py-2 font-semibold text-[#FFD66B] bg-white/10 border border-white/10 active:opacity-80"
        >
          Quay lại
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-6">
        <VietQR initialAmount={amount} />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-6 grid place-items-center text-center gap-3">
        <button
          type="button"
          onClick={sendToGoogleSheet}
          disabled={isSending}
          className={
            "rounded-full px-10 py-4 font-extrabold text-[18px] text-white " +
            (isSending ? "bg-white/10" : "bg-[#FF3B30] active:opacity-80")
          }
        >
          {isSending ? "Đang gửi..." : "Xác nhận đã chuyển khoản"}
        </button>

        <div className="text-[#FFD66B]/80 text-[14px]">
          * Nếu bạn chưa chuyển khoản, vui lòng quét QR và chuyển đúng số tiền.
        </div>

        {sendError ? <div className="text-[#FF6B5E] text-sm font-semibold">Lỗi: {sendError}</div> : null}
      </div>

      {showThanks ? (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm grid place-items-center px-4">
          <div className="w-full max-w-[420px] rounded-[28px] border border-white/10 bg-[#0b0f12]/90 shadow-[0_30px_90px_rgba(0,0,0,0.6)] px-6 py-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#34C759]/15 border border-[#34C759]/30 grid place-items-center">
              <span aria-hidden className="text-[#34C759] text-2xl">✓</span>
            </div>

            <div className="mt-4 text-[#FFD66B] text-[22px] font-extrabold">
              Cảm ơn bạn đã đặt hàng!
            </div>
            <div className="mt-2 text-white/70 text-[14px] leading-6">
              Shop đã nhận xác nhận chuyển khoản của bạn.
              <br />
              Chúng tôi sẽ kiểm tra và liên hệ sớm nhất.
            </div>

            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowThanks(false)
                  router.push("/thanh-toan")
                }}
                className="w-full rounded-full px-6 py-3 font-bold text-white bg-[#FF3B30] active:opacity-80"
              >
                Quay về Thanh toán
              </button>
              <button
                type="button"
                onClick={() => setShowThanks(false)}
                className="w-full rounded-full px-6 py-3 font-semibold text-[#FFD66B] bg-white/10 border border-white/10 active:opacity-80"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}