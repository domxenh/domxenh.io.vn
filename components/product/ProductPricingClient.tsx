// components/product/ProductPricingClient.tsx
"use client"

import { useEffect, useMemo, useState } from "react"

type ChangeDetail = {
  price: number
  oldPrice: number | null
  sku: string
  label: string
}

function fmtVnd(n: number) {
  return n.toLocaleString("vi-VN") + " đ"
}

export default function ProductPricingClient({
  name, // giữ để không phá call cũ
  inStock, // giữ để không phá call cũ
  initialPrice,
  initialOldPrice,
}: {
  name: string
  inStock: boolean
  initialPrice: number
  initialOldPrice: number | null
}) {
  const [price, setPrice] = useState(initialPrice)
  const [oldPrice, setOldPrice] = useState<number | null>(initialOldPrice)

  useEffect(() => {
    const onChange = (e: Event) => {
      const ce = e as CustomEvent<ChangeDetail>
      if (!ce.detail) return
      setPrice(ce.detail.price)
      setOldPrice(ce.detail.oldPrice ?? null)
    }

    const onReset = () => {
      setPrice(initialPrice)
      setOldPrice(initialOldPrice ?? null)
    }

    window.addEventListener("edison-sku-change", onChange as EventListener)
    window.addEventListener("edison-sku-reset", onReset as EventListener)

    return () => {
      window.removeEventListener("edison-sku-change", onChange as EventListener)
      window.removeEventListener("edison-sku-reset", onReset as EventListener)
    }
  }, [initialPrice, initialOldPrice])

  const priceText = useMemo(() => fmtVnd(price), [price])
  const oldPriceText = useMemo(() => (oldPrice ? fmtVnd(oldPrice) : null), [oldPrice])

  const discountPercent = useMemo(() => {
    if (!oldPrice || oldPrice <= price) return null
    return Math.round(((oldPrice - price) / oldPrice) * 100)
  }, [oldPrice, price])

  return (
    <div className="mt-5 flex items-end gap-3 flex-wrap">
      {typeof discountPercent === "number" && discountPercent > 0 ? (
        <span className="shrink-0 rounded-full px-3 py-1.5 text-sm font-extrabold bg-[#FF3B30] text-white shadow-[0_0_18px_rgba(255,59,48,0.35)]">
          -{discountPercent}%
        </span>
      ) : null}

      <div className="text-[#FFD66B] text-2xl font-extrabold drop-shadow-[0_0_34px_rgba(255,214,107,0.95)] whitespace-nowrap">
        {priceText}
      </div>

      {oldPriceText ? (
        <div className="text-white/45 line-through whitespace-nowrap">{oldPriceText}</div>
      ) : null}
    </div>
  )
}

// end code