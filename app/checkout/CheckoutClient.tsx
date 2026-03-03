// app/checkout/CheckoutClient.tsx
"use client"

/**
 * TÓM TẮT (VN):
 * - Trang VietQR nhận query ?amount=...
 * - CHỈNH:
 *   + Hỗ trợ ?mode=deposit để hiển thị đặt cọc 50k.
 *   + Thêm nút "Tôi đã chuyển cọc" => gửi eventType=deposit_confirm lên Sheet.
 *   + Vẫn giữ flow chuyển khoản toàn bộ (mode thường) có nút "Xác nhận đã chuyển khoản".
 *
 * NƠI CHỈNH:
 * - Thêm confirmDepositPaid() + UI Apple modal cảm ơn trong mode=deposit
 */

import { useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import VietQR from "@/components/VietQR"
import { getCart } from "@/components/cart/cartStore"

const SHIPPING_KEY = "domxenh_checkout_shipping_v1"
const LAST_SENT_KEY = "domxenh_last_confirm_v1"

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
  const map = new Map<string, number>()
  for (const it of cart) {
    const sku = (it.skuCode || "").trim()
    if (!sku) continue
    map.set(sku, (map.get(sku) || 0) + (it.qty || 1))
  }
  return Array.from(map.entries())
    .map(([sku, qty]) => `${sku} x${qty}`)
    .join(" | ")
}

function getOrCreateOrderId() {
  const k = "domxenh_orderid_v1"
  const old = localStorage.getItem(k)
  if (old) return old
  const id = (crypto?.randomUUID?.() || `oid_${Date.now()}_${Math.random().toString(16).slice(2)}`)
  localStorage.setItem(k, id)
  return id
}

export default function CheckoutClient() {
  const sp = useSearchParams()
  const router = useRouter()
  const amount = useMemo(() => toInt(sp.get("amount")), [sp])

  const mode = useMemo(() => (sp.get("mode") || "").trim(), [sp])
  const isDeposit = mode === "deposit"

  // (optional) totalAmount đính kèm nếu bạn muốn hiển thị/ghi sheet
  const totalAmount = useMemo(() => toInt(sp.get("total") || "0"), [sp])

  const [isSending, setIsSending] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [sendError, setSendError] = useState<string>("")

  // ✅ CHỈNH: confirm cọc
  const [depositConfirmSending, setDepositConfirmSending] = useState(false)
  const [depositConfirmError, setDepositConfirmError] = useState("")
  const [depositThanks, setDepositThanks] = useState(false)

  async function confirmTransfer() {
    setSendError("")

    const now = Date.now()
    const last = Number(localStorage.getItem(LAST_SENT_KEY) || 0)
    if (now - last < 60_000) {
      alert("Bạn vừa gửi xác nhận. Vui lòng thử lại sau 1 phút.")
      return
    }
    localStorage.setItem(LAST_SENT_KEY, String(now))

    const shipping =
      safeJsonParse<{
        receiverName?: string
        phone?: string
        region?: string
        street?: string
      }>(localStorage.getItem(SHIPPING_KEY)) || {}

    const itemsText = buildItemsText()
    const orderId = getOrCreateOrderId()

    const payload = {
      orderId,
      eventType: "bank_confirm",
      paymentMethod: "bank_transfer",
      amount,
      shipping: {
        receiverName: shipping.receiverName || "",
        phone: shipping.phone || "",
        region: shipping.region || "",
        street: shipping.street || "",
      },
      itemsText,
    }

    setIsSending(true)
    try {
      const res = await fetch("/api/confirm-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const t = await res.text().catch(() => "")
        throw new Error(t || `Lỗi gửi dữ liệu (${res.status})`)
      }

      setShowThanks(true)
    } catch (e: any) {
      setSendError(e?.message || "Gửi dữ liệu thất bại")
    } finally {
      setIsSending(false)
    }
  }

  // ✅ CHỈNH: khách bấm "Tôi đã chuyển cọc" => gửi eventType=deposit_confirm
  async function confirmDepositPaid() {
    setDepositConfirmError("")

    const now = Date.now()
    const last = Number(localStorage.getItem(LAST_SENT_KEY) || 0)
    if (now - last < 60_000) {
      alert("Bạn vừa gửi xác nhận. Vui lòng thử lại sau 1 phút.")
      return
    }
    localStorage.setItem(LAST_SENT_KEY, String(now))

    const shipping =
      safeJsonParse<{
        receiverName?: string
        phone?: string
        region?: string
        street?: string
      }>(localStorage.getItem(SHIPPING_KEY)) || {}

    const itemsText = buildItemsText()
    const orderId = getOrCreateOrderId()

    const payload = {
      orderId,
      eventType: "deposit_confirm", // ✅ CHỈNH
      paymentMethod: "cod_deposit",
      amount: 50000,
      totalAmount: totalAmount > 0 ? totalAmount : undefined,
      shipping: {
        receiverName: shipping.receiverName || "",
        phone: shipping.phone || "",
        region: shipping.region || "",
        street: shipping.street || "",
      },
      itemsText,
    }

    setDepositConfirmSending(true)
    try {
      const res = await fetch("/api/confirm-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok && res.status !== 409) {
        const t = await res.text().catch(() => "")
        throw new Error(t || `Lỗi gửi dữ liệu (${res.status})`)
      }

      setDepositThanks(true)
    } catch (e: any) {
      setDepositConfirmError(e?.message || "Gửi xác nhận cọc thất bại")
    } finally {
      setDepositConfirmSending(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-28">
      <div className="grid place-items-center text-center gap-3">
        <h1 className="text-[34px] font-extrabold text-[#FFD66B] drop-shadow-[0_0_14px_rgba(255,214,107,0.35)]">
          {isDeposit ? "Đặt cọc 50.000đ (VietQR)" : "Thanh toán chuyển khoản (VietQR)"}
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

      {isDeposit ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-6 text-center">
          <div className="text-white/80 leading-6">
            Bạn vui lòng chuyển khoản <span className="text-[#FFD66B] font-bold">50.000đ</span> tiền cọc.
            <br />
            Shop sẽ đi đơn ngay và trừ cọc vào tổng tiền khi bạn nhận hàng.
          </div>

          {depositConfirmError ? (
            <div className="mt-3 text-[#FF6B5E] text-sm font-semibold">Lỗi: {depositConfirmError}</div>
          ) : null}

          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              type="button"
              onClick={() => router.push("/thanh-toan")}
              className="rounded-full px-6 py-3 font-semibold text-[#FFD66B] bg-white/10 border border-white/10 active:opacity-80"
            >
              Quay về Thanh toán
            </button>

            {/* ✅ CHỈNH: nút xác nhận cọc */}
            <button
              type="button"
              onClick={confirmDepositPaid}
              disabled={depositConfirmSending}
              className={
                "rounded-full px-7 py-3 font-extrabold text-white active:opacity-80 disabled:opacity-60 " +
                (depositConfirmSending ? "bg-white/10" : "bg-[#FF3B30]")
              }
            >
              {depositConfirmSending ? "Đang gửi..." : "Tôi đã chuyển cọc"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-6 grid place-items-center text-center gap-3">
          <button
            type="button"
            onClick={confirmTransfer}
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

          {sendError ? (
            <div className="text-[#FF6B5E] text-sm font-semibold">Lỗi: {sendError}</div>
          ) : null}
        </div>
      )}

      {/* Apple modal thanks (bank) */}
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

      {/* ✅ CHỈNH: Apple modal thanks (deposit confirm) */}
      {depositThanks ? (
        <div className="fixed inset-0 z-[85] bg-black/50 backdrop-blur-sm grid place-items-center px-4">
          <div className="w-full max-w-[420px] rounded-[28px] border border-white/10 bg-[#0b0f12]/90 shadow-[0_30px_90px_rgba(0,0,0,0.6)] px-6 py-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#34C759]/15 border border-[#34C759]/30 grid place-items-center">
              <span aria-hidden className="text-[#34C759] text-2xl">✓</span>
            </div>

            <div className="mt-4 text-[#FFD66B] text-[22px] font-extrabold">
              Shop đã nhận xác nhận cọc!
            </div>
            <div className="mt-2 text-white/70 text-[14px] leading-6">
              Shop sẽ kiểm tra giao dịch và đi đơn sớm nhất.
              <br />
              Tiền cọc sẽ được trừ vào tổng tiền khi bạn nhận hàng.
            </div>

            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={() => {
                  setDepositThanks(false)
                  router.push("/thanh-toan")
                }}
                className="w-full rounded-full px-6 py-3 font-bold text-white bg-[#FF3B30] active:opacity-80"
              >
                Quay về Thanh toán
              </button>
              <button
                type="button"
                onClick={() => setDepositThanks(false)}
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

// end code