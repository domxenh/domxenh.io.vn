// components/cart/CartPopup.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CartItem, cartTotal, closeCart, getCart, removeFromCart, updateQty } from "./cartStore"

function fmtVnd(n: number) {
  return n.toLocaleString("vi-VN") + " đ"
}

type CartChangedDetail = {
  items?: CartItem[]
  total?: number
}

export default function CartPopup() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    // init 1 lần
    setItems(getCart())

    const onChanged = (e: Event) => {
      const ce = e as CustomEvent<CartChangedDetail>
      if (ce.detail?.items) {
        setItems(ce.detail.items)
      } else {
        setItems(getCart())
      }
    }

    const onOpen = () => {
      // mở là refresh 1 lần (nhẹ)
      setItems(getCart())
      setOpen(true)
    }

    const onClose = () => setOpen(false)

    window.addEventListener("cart:changed", onChanged as EventListener)
    window.addEventListener("cart:open", onOpen)
    window.addEventListener("cart:close", onClose)

    return () => {
      window.removeEventListener("cart:changed", onChanged as EventListener)
      window.removeEventListener("cart:open", onOpen)
      window.removeEventListener("cart:close", onClose)
    }
  }, [])

  const total = useMemo(() => cartTotal(items), [items])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        aria-label="Đóng giỏ hàng"
        className="absolute inset-0 bg-black/55"
        onClick={() => {
          setOpen(false)
          closeCart()
        }}
      />

      <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-[#0B1417]/95 border-l border-white/10 backdrop-blur-0 md:backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.75)] p-4 sm:p-5 overflow-y-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="text-white font-semibold text-lg">Giỏ hàng</div>
          <button
            className="rounded-full px-3 py-1.5 border border-white/12 bg-white/5 text-white/85 hover:bg-white/10 transition"
            onClick={() => {
              setOpen(false)
              closeCart()
            }}
          >
            Đóng
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-white/70 border border-white/10 bg-white/5 rounded-2xl p-4">
              Giỏ hàng đang trống.
            </div>
          ) : (
            items.map((it) => (
              <div key={it.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[#FFD66B] font-semibold leading-snug">{it.skuLabel}</div>
                    <div className="mt-1 text-white/70 text-sm">
                      {fmtVnd(it.price)}
                      {it.oldPrice && it.oldPrice > it.price ? (
                        <span className="text-white/40 line-through ml-2">{fmtVnd(it.oldPrice)}</span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="text-white/55 text-sm">Số lượng</div>
                      <div className="flex items-center rounded-full border border-white/12 bg-black/20 overflow-hidden">
                        <button
                          className="h-9 w-10 text-white/90 hover:bg-white/5 transition"
                          onClick={() => updateQty(it.key, it.qty - 1)}
                        >
                          −
                        </button>
                        <div className="h-9 w-12 grid place-items-center text-white font-semibold">{it.qty}</div>
                        <button
                          className="h-9 w-10 text-white/90 hover:bg-white/5 transition"
                          onClick={() => updateQty(it.key, it.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    className="shrink-0 rounded-full px-3 py-2 border border-white/12 bg-white/5 text-white/80 hover:bg-white/10 transition"
                    onClick={() => removeFromCart(it.key)}
                    aria-label="Xóa sản phẩm"
                    title="Xóa"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
          <div className="flex items-center justify-between">
            <div className="text-white/70">Tổng</div>
            <div className="text-[#FFD66B] font-extrabold">{fmtVnd(total)}</div>
          </div>

          <Link
            href="/thanh-toan"
            className="mt-4 block text-center rounded-full px-6 py-3 font-semibold text-white border border-[#FF3B30]/35 bg-[#FF3B30] shadow-[0_0_26px_rgba(255,59,48,0.22)] hover:brightness-105 transition"
            onClick={() => {
              setOpen(false)
              closeCart()
            }}
          >
            Thanh toán luôn
          </Link>
        </div>
      </div>
    </div>
  )
}