// app/thanh-toan/CheckoutClient.tsx
"use client"

/**
 * TÓM TẮT (VN):
 * - COD + đặt cọc: bấm Đặt Hàng => hiện modal Apple.
 * - Không đồng ý: đóng modal.
 * - Đồng ý:
 *   1) Gửi đơn lên Sheet (eventType=deposit_request, paymentMethod=cod_deposit, amount=50000)
 *   2) Chuyển /checkout?amount=50000&mode=deposit
 *
 * NƠI CHỈNH:
 * - agreeDepositAndGoPay(): thêm eventType=deposit_request
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CartItem,
  cartTotal,
  getCart,
  removeFromCart,
  updateQty,
} from "@/components/cart/cartStore"

function fmtVnd(n: number) {
  const v = Math.max(0, Math.round(n))
  return v.toLocaleString("vi-VN") + " đ"
}

function normalizeVoucher(raw: string) {
  return (raw || "").trim().toUpperCase()
}

const STORAGE_KEY = "domxenh_checkout_shipping_v1"

type ShippingInfo = {
  receiverName: string
  phone: string
  region: string
  street: string
}

function loadShippingInfo(): ShippingInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ShippingInfo>
    return {
      receiverName: String(parsed.receiverName || ""),
      phone: String(parsed.phone || ""),
      region: String(parsed.region || ""),
      street: String(parsed.street || ""),
    }
  } catch {
    return null
  }
}

function saveShippingInfo(data: ShippingInfo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

function getOrCreateOrderId() {
  const k = "domxenh_orderid_v1"
  const old = localStorage.getItem(k)
  if (old) return old
  const id =
    (crypto?.randomUUID?.() ||
      `oid_${Date.now()}_${Math.random().toString(16).slice(2)}`)
  localStorage.setItem(k, id)
  return id
}

function buildItemsTextFromCart(items: CartItem[]) {
  const map = new Map<string, number>()
  for (const it of items) {
    const sku = (it.skuCode || "").trim()
    if (!sku) continue
    map.set(sku, (map.get(sku) || 0) + (it.qty || 1))
  }
  return Array.from(map.entries())
    .map(([sku, qty]) => `${sku} x${qty}`)
    .join(" | ")
}

function parseQuickInfo(raw: string) {
  const text = (raw || "").trim()
  if (!text) return null

  const phoneMatch = text.match(/(\+?84|0)\s*[\d\s]{8,12}/)
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, "") : ""

  let cleaned = text
  if (phone) cleaned = cleaned.replace(phoneMatch![0], " ")
  cleaned = cleaned.replace(/\s+/g, " ").trim()

  const lines = text
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)

  let name = ""
  let address = ""

  if (lines.length >= 2) {
    name = lines[0]
    const rest = lines
      .slice(1)
      .filter((l) => !(phone && l.includes(phoneMatch ? phoneMatch[0].trim() : "")))
      .join(" ")
      .trim()
    address = rest || cleaned
  } else {
    const parts = cleaned.split(",").map((s) => s.trim()).filter(Boolean)
    if (parts.length >= 2) {
      name = parts[0]
      address = parts.slice(1).join(", ")
    } else {
      const tokens = cleaned.split(" ").filter(Boolean)
      name = tokens.slice(0, Math.min(4, tokens.length)).join(" ")
      address = tokens.slice(Math.min(4, tokens.length)).join(" ")
    }
  }

  if (phone) name = name.replace(phone, "").trim()

  return { name: name.trim(), phone: phone.trim(), address: address.trim() }
}

export default function CheckoutClient() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])

  const [quickText, setQuickText] = useState("")
  const canApplyQuick = quickText.trim().length > 0

  const [receiverName, setReceiverName] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")
  const [street, setStreet] = useState("")

  const [voucher, setVoucher] = useState("")
  const voucherCode = useMemo(() => normalizeVoucher(voucher), [voucher])
  const isDOMMPS = voucherCode === "DOMMPS"
  const isDOMXENH = voucherCode === "DOMXENH"
  const voucherDiscount = isDOMXENH ? 10000 : 0

  const [payMethod, setPayMethod] = useState<"cod_deposit" | "bank">("cod_deposit")

  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositSending, setDepositSending] = useState(false)
  const [depositError, setDepositError] = useState("")

  useEffect(() => {
    setItems(getCart())
    const onChanged = () => setItems(getCart())
    window.addEventListener("cart:changed", onChanged)
    return () => window.removeEventListener("cart:changed", onChanged)
  }, [])

  useEffect(() => {
    const saved = loadShippingInfo()
    if (!saved) return
    if (saved.receiverName) setReceiverName(saved.receiverName)
    if (saved.phone) setPhone(saved.phone)
    if (saved.region) setRegion(saved.region)
    if (saved.street) setStreet(saved.street)
  }, [])

  const saveTimer = useRef<number | null>(null)
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      saveShippingInfo({ receiverName, phone, region, street })
    }, 200)

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [receiverName, phone, region, street])

  const goodsTotal = useMemo(() => cartTotal(items), [items])
  const finalTotal = useMemo(
    () => Math.max(0, goodsTotal - voucherDiscount),
    [goodsTotal, voucherDiscount]
  )
  const saving = useMemo(() => (isDOMXENH ? 10000 : 0), [isDOMXENH])

  function applyQuick() {
    const parsed = parseQuickInfo(quickText)
    if (!parsed) return

    if (parsed.name) setReceiverName(parsed.name)
    if (parsed.phone) setPhone(parsed.phone)

    const addr = parsed.address || ""
    if (addr) {
      const parts = addr.split(",").map((s) => s.trim()).filter(Boolean)
      if (parts.length >= 3) {
        const reg = parts.slice(-3).join(", ")
        const str = parts.slice(0, -3).join(", ")
        setRegion(reg)
        setStreet(str || addr)
      } else if (parts.length === 2) {
        setRegion(parts[1])
        setStreet(parts[0])
      } else {
        setStreet(addr)
      }
    }

    setQuickText("")
  }

  function inc(key: string) {
    const it = items.find((x) => x.key === key)
    if (!it) return
    updateQty(key, it.qty + 1)
  }

  function dec(key: string) {
    const it = items.find((x) => x.key === key)
    if (!it) return
    updateQty(key, Math.max(1, it.qty - 1))
  }

  function placeOrder() {
    if (items.length === 0) {
      alert("Giỏ hàng đang trống.")
      return
    }
    if (!receiverName.trim() || !phone.trim() || !region.trim() || !street.trim()) {
      alert("Vui lòng nhập đầy đủ: Tên người nhận, Số điện thoại, Khu vực, Địa chỉ chi tiết.")
      return
    }

    if (payMethod === "bank") {
      router.push(`/checkout?amount=${encodeURIComponent(String(finalTotal))}`)
      return
    }

    setDepositError("")
    setShowDepositModal(true)
  }

  async function agreeDepositAndGoPay() {
    setDepositError("")
    setDepositSending(true)

    try {
      const orderId = getOrCreateOrderId()
      const itemsText = buildItemsTextFromCart(items)

      const payload = {
        orderId,
        eventType: "deposit_request", // ✅ CHỈNH
        paymentMethod: "cod_deposit",
        amount: 50000,
        totalAmount: finalTotal,
        shipping: {
          receiverName: receiverName.trim(),
          phone: phone.trim(),
          region: region.trim(),
          street: street.trim(),
        },
        itemsText,
      }

      const res = await fetch("/api/confirm-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok && res.status !== 409) {
        const t = await res.text().catch(() => "")
        throw new Error(t || `Lỗi gửi dữ liệu (${res.status})`)
      }

      setShowDepositModal(false)
      router.push(`/checkout?amount=50000&mode=deposit`)
    } catch (e: any) {
      setDepositError(e?.message || "Gửi dữ liệu thất bại")
    } finally {
      setDepositSending(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-28">
      <h1 className="text-3xl font-semibold text-[#FFD66B]">Thanh toán</h1>
      <p className="mt-2 text-white/70">
        Tổng tiền: <span className="text-white font-semibold">{fmtVnd(finalTotal)}</span>
      </p>

      <section className="mt-6 rounded-2xl border border-[#FF3B30]/30 bg-white/5 backdrop-blur px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 text-[#FF3B30]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            </svg>
          </div>

          <div className="flex-1">
            <div className="text-[#FF6B5E] font-semibold">Dán và nhập nhanh</div>
            <div className="text-white/60 text-sm mt-1">
              Dán hoặc nhập thông tin, nhấn chọn <b>Tự động điền</b> để nhập tên, số điện thoại và địa chỉ.
            </div>

            <textarea
              value={quickText}
              onChange={(e) => setQuickText(e.target.value)}
              rows={3}
              placeholder="Dán hoặc nhập thông tin..."
              className="mt-3 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none"
            />

            <div className="mt-3 flex justify-end">
              {canApplyQuick ? (
                <button
                  type="button"
                  onClick={applyQuick}
                  className="rounded-full px-5 py-2 font-semibold text-white bg-[#FF3B30] active:opacity-80"
                >
                  Nhập
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {showDepositModal ? (
        <div className="fixed inset-0 z-[120] bg-black/55 backdrop-blur-sm grid place-items-center px-4">
          <div className="w-full max-w-[520px] rounded-[28px] border border-white/10 bg-[#0b0f12]/92 shadow-[0_30px_110px_rgba(0,0,0,0.72)] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10">
              <div className="text-white/60 text-sm">Xác nhận đặt cọc</div>
              <div className="mt-1 text-[#FFD66B] text-[22px] font-extrabold drop-shadow-[0_0_18px_rgba(255,214,107,0.35)]">
                Bạn vui lòng cọc giúp Shop 50k trước
              </div>
            </div>

            <div className="px-6 py-5 text-white/80 leading-6">
              Bạn vui lòng cọc giúp Shop 50k trước để shop đi đơn luôn cho bạn nhé.
              <br />
              Số tiền cọc sẽ được trừ vào tổng tiền khi bạn nhận hàng.
              <br />
              Shop cảm ơn bạn.
              {depositError ? (
                <div className="mt-3 text-[#FF6B5E] text-sm font-semibold">Lỗi: {depositError}</div>
              ) : null}
            </div>

            <div className="px-6 py-5 border-t border-white/10 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                disabled={depositSending}
                className="rounded-full px-5 py-3 font-semibold text-[#FFD66B] bg-white/10 border border-white/10 active:opacity-80 disabled:opacity-60"
              >
                Không đồng ý
              </button>
              <button
                type="button"
                onClick={agreeDepositAndGoPay}
                disabled={depositSending}
                className={
                  "rounded-full px-6 py-3 font-extrabold text-white active:opacity-80 disabled:opacity-60 " +
                  (depositSending ? "bg-white/10" : "bg-[#FF3B30]")
                }
              >
                {depositSending ? "Đang xử lý..." : "Đồng ý"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <div className="text-white font-semibold">Thông tin nhận hàng</div>

        <div className="mt-3 grid gap-3">
          <div>
            <label className="text-white/60 text-sm">Tên người nhận</label>
            <input
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm">Số điện thoại</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none"
              inputMode="tel"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm">Tỉnh/Thành Phố, Quận Huyện, Phường/Xã</label>
            <input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none"
            />
          </div>

          <div>
            <label className="text-white/60 text-sm">Tên đường, Tòa nhà, Số nhà</label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="mt-1 w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none"
            />
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <div className="text-white font-semibold">Sản phẩm (SKU)</div>

        {items.length === 0 ? (
          <div className="mt-3 text-white/60">Giỏ hàng đang trống.</div>
        ) : (
          <div className="mt-3 space-y-3">
            {items.map((it) => (
              <div key={it.key} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={it.image}
                          alt={it.skuLabel || it.productName}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-white/30 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-white font-semibold truncate">{it.skuLabel}</div>
                      <div className="text-white/60 text-sm truncate">
                        SKU: <span className="text-white/80">{it.skuCode}</span>
                      </div>

                      <div className="mt-1 w-[160px] text-left text-[18px] leading-6 font-extrabold text-[#FFD66B] drop-shadow-[0_0_10px_rgba(255,214,107,0.35)]">
                        {fmtVnd(it.price)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => dec(it.key)}
                      className="h-9 w-9 rounded-full bg-white/10 text-white font-bold active:opacity-80"
                    >
                      −
                    </button>
                    <div className="min-w-[28px] text-center text-white font-semibold">{it.qty}</div>
                    <button
                      type="button"
                      onClick={() => inc(it.key)}
                      className="h-9 w-9 rounded-full bg-white/10 text-white font-bold active:opacity-80"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromCart(it.key)}
                      className="ml-2 text-white/60 text-sm underline underline-offset-4 active:opacity-80"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <div className="text-white font-semibold">Shop voucher</div>

        <div className="mt-3 flex items-center gap-3">
          <input
            value={voucher}
            onChange={(e) => setVoucher(e.target.value)}
            className="flex-1 rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none"
            placeholder="Nhập voucher..."
          />

          {isDOMMPS ? (
            <div className="shrink-0 flex items-center gap-2 rounded-full px-4 py-2 bg-[#34C759]/15 border border-[#34C759]/30 text-[#34C759] font-semibold">
              <span aria-hidden>🚚</span> Miễn phí vận chuyển
            </div>
          ) : null}

          {isDOMXENH ? (
            <div className="shrink-0 flex items-center gap-2 rounded-full px-4 py-2 bg-[#FF3B30]/15 border border-[#FF3B30]/30 text-[#FF6B5E] font-semibold">
              <span aria-hidden>🏷️</span> -10000
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <div className="text-white font-semibold">Phương thức thanh toán</div>

        <div className="mt-3 space-y-3">
          <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-[#FF3B30]" aria-hidden>📦</span>
              <div className="text-white font-semibold">Thanh toán khi nhận hàng &amp; đặt cọc</div>
            </div>
            <input
              type="radio"
              name="pay"
              checked={payMethod === "cod_deposit"}
              onChange={() => setPayMethod("cod_deposit")}
              className="h-5 w-5"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-[#FFD66B]" aria-hidden>🏦</span>
              <div className="text-white font-semibold">Chuyển khoản</div>
            </div>
            <input
              type="radio"
              name="pay"
              checked={payMethod === "bank"}
              onChange={() => setPayMethod("bank")}
              className="h-5 w-5"
            />
          </label>
        </div>
      </section>

      <div className="fixed left-0 right-0 bottom-0 z-50">
        <div className="max-w-4xl mx-auto px-6 pb-5">
          <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-1 items-center">
                <div className="text-[15px] leading-5 font-semibold text-white">Tổng cộng</div>
                <div className="text-right text-[18px] leading-5 font-extrabold text-[#FFD66B] tabular-nums drop-shadow-[0_0_12px_rgba(255,214,107,0.45)]">
                  {fmtVnd(finalTotal)}
                </div>

                <div className="text-[15px] leading-5 font-semibold text-white">Tiết kiệm</div>
                <div className="text-right text-[18px] leading-5 font-extrabold text-[#FFD66B] tabular-nums drop-shadow-[0_0_12px_rgba(255,214,107,0.45)]">
                  {fmtVnd(saving)}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={placeOrder}
              disabled={items.length === 0}
              className={
                "rounded-full px-6 py-3 font-semibold text-white " +
                (items.length === 0 ? "bg-white/10" : "bg-[#FF3B30] active:opacity-80")
              }
            >
              Đặt Hàng
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

// end code