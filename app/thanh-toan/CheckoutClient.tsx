// app/thanh-toan/CheckoutClient.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { CartItem, cartTotal, clearCart, getCart } from "@/components/cart/cartStore"

function fmtVnd(n: number) {
  return n.toLocaleString("vi-VN") + " đ"
}

export default function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(getCart())
    const onChanged = () => setItems(getCart())
    window.addEventListener("cart:changed", onChanged)
    return () => window.removeEventListener("cart:changed", onChanged)
  }, [])

  const total = useMemo(() => cartTotal(items), [items])

  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-16">
      <h1 className="text-3xl font-semibold text-[#FFD66B]">Thanh toán</h1>
      <p className="mt-2 text-white/70">Tổng tiền: <span className="text-white font-semibold">{fmtVnd(total)}</span></p>

      <button
        className="mt-6 rounded-full px-6 py-3 font-semibold text-white bg-[#FF3B30]"
        disabled={items.length === 0}
        onClick={() => {
          alert("Demo thanh toán thành công!")
          clearCart()
        }}
      >
        Xác nhận đặt hàng
      </button>
    </main>
  )
}