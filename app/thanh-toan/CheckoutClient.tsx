// app/thanh-toan/CheckoutClient.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CartItem,
  cartTotal,
  clearCart,
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

// Nhận dạng: phone trước, name & address sau (heuristic nhẹ, đủ dùng)
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

  // Quick paste box
  const [quickText, setQuickText] = useState("")
  const canApplyQuick = quickText.trim().length > 0

  // Form fields (SẼ ĐƯỢC LƯU localStorage)
  const [receiverName, setReceiverName] = useState("")
  const [phone, setPhone] = useState("")
  const [region, setRegion] = useState("")
  const [street, setStreet] = useState("")

  // Voucher
  const [voucher, setVoucher] = useState("")
  const voucherCode = useMemo(() => normalizeVoucher(voucher), [voucher])
  const isDOMMPS = voucherCode === "DOMMPS"
  const isDOMXENH = voucherCode === "DOMXENH"
  const voucherDiscount = isDOMXENH ? 10000 : 0

  // Payment method
  const [payMethod, setPayMethod] = useState<"cod_deposit" | "bank">("cod_deposit")

  useEffect(() => {
    setItems(getCart())
    const onChanged = () => setItems(getCart())
    window.addEventListener("cart:changed", onChanged)
    return () => window.removeEventListener("cart:changed", onChanged)
  }, [])

  // ✅ Load Thông tin nhận hàng từ localStorage
  useEffect(() => {
    const saved = loadShippingInfo()
    if (!saved) return
    if (saved.receiverName) setReceiverName(saved.receiverName)
    if (saved.phone) setPhone(saved.phone)
    if (saved.region) setRegion(saved.region)
    if (saved.street) setStreet(saved.street)
  }, [])

  // ✅ Auto-save (debounce nhẹ)
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

    // ✅ Chuyển khoản: sang trang QR, tự điền amount
    if (payMethod === "bank") {
      router.push(`/checkout?amount=${encodeURIComponent(String(finalTotal))}`)
      return
    }

    // COD: giữ flow cũ
    const summary =
      `Đặt hàng thành công (demo)!\n\n` +
      `Tên: ${receiverName}\n` +
      `SĐT: ${phone}\n` +
      `Khu vực: ${region}\n` +
      `Địa chỉ: ${street}\n\n` +
      `Phương thức: Thanh toán khi nhận hàng & đặt cọc\n` +
      `Voucher: ${voucherCode || "(không)"}\n` +
      `Tổng thanh toán: ${fmtVnd(finalTotal)}`
    alert(summary)
    clearCart()
  }

  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-28">
      <h1 className="text-3xl font-semibold text-[#FFD66B]">Thanh toán</h1>
      <p className="mt-2 text-white/70">
        Tổng tiền: <span className="text-white font-semibold">{fmtVnd(finalTotal)}</span>
      </p>

      {/* BOX 1: Quick paste */}
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

      {/* BOX 2: Thông tin nhận hàng */}
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

      {/* BOX 3: SKU list (giữ nguyên logic) */}
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

      {/* BOX 4: Voucher */}
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

      {/* BOX 5: Payment */}
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

      {/* Bottom floating bar (giữ căn số thẳng hàng + vàng) */}
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