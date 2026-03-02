// components/cart/FloatingCartButton.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { getCart, openCart } from "./cartStore"

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6.5 6h14l-1.3 7.2a2 2 0 0 1-2 1.6H9a2 2 0 0 1-2-1.6L5.3 3.8H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" fill="currentColor" />
    </svg>
  )
}

export default function FloatingCartButton() {
  const [count, setCount] = useState(0)

  const refresh = () => {
    const items = getCart()
    setCount(items.reduce((s, it) => s + it.qty, 0))
  }

  useEffect(() => {
    refresh()
    const onChanged = () => refresh()
    window.addEventListener("cart:changed", onChanged)
    return () => window.removeEventListener("cart:changed", onChanged)
  }, [])

  const badge = useMemo(() => (count > 99 ? "99+" : String(count)), [count])

  return (
    <button
      type="button"
      onClick={() => openCart()}
      className="fixed right-4 bottom-28 z-[95] rounded-full px-4 py-3 border border-white/12 bg-black/55 backdrop-blur-2xl text-white/90 shadow-[0_20px_70px_rgba(0,0,0,0.7)] hover:bg-black/65 transition inline-flex items-center gap-2"
      aria-label="Mở giỏ hàng"
      title="Giỏ hàng"
    >
      <CartIcon />
      <span className="font-semibold">Giỏ</span>
      {count > 0 ? (
        <span className="ml-1 rounded-full px-2 py-0.5 text-xs font-extrabold bg-[#FF3B30] text-white">
          {badge}
        </span>
      ) : null}
    </button>
  )
}