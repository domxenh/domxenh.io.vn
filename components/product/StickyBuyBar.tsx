// components/product/StickyBuyBar.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { addToCart, openCart } from "@/components/cart/cartStore"

type SkuChangeDetail = {
  productSlug: string
  skuCode: string
  label: string
  image: string
  price: number
  oldPrice: number | null
}

function fmtVnd(n: number) {
  return n.toLocaleString("vi-VN") + " đ"
}

export default function StickyBuyBar({
  productSlug,
  productName,
  initialSkuLabel,
  initialSkuCode,
  initialImage,
  initialPrice,
  initialOldPrice,
  inStock,
}: {
  productSlug: string
  productName: string
  initialSkuLabel: string
  initialSkuCode: string
  initialImage: string
  initialPrice: number
  initialOldPrice: number | null
  inStock: boolean
}) {
  const [label, setLabel] = useState(initialSkuLabel)
  const [skuCode, setSkuCode] = useState(initialSkuCode)
  const [image, setImage] = useState(initialImage)
  const [price, setPrice] = useState(initialPrice)
  const [oldPrice, setOldPrice] = useState<number | null>(initialOldPrice)

  useEffect(() => {
    const onChange = (e: Event) => {
      const ce = e as CustomEvent<SkuChangeDetail>
      if (!ce.detail) return
      if (ce.detail.productSlug !== productSlug) return
      setLabel(ce.detail.label || productName)
      setSkuCode(ce.detail.skuCode || initialSkuCode)
      setImage(ce.detail.image || initialImage)
      setPrice(ce.detail.price)
      setOldPrice(ce.detail.oldPrice ?? null)
    }

    const onReset = (e: Event) => {
      const ce = e as CustomEvent<{ productSlug: string }>
      if (ce?.detail?.productSlug && ce.detail.productSlug !== productSlug) return
      setLabel(initialSkuLabel)
      setSkuCode(initialSkuCode)
      setImage(initialImage)
      setPrice(initialPrice)
      setOldPrice(initialOldPrice ?? null)
    }

    window.addEventListener("sku:change", onChange as EventListener)
    window.addEventListener("sku:reset", onReset as EventListener)
    return () => {
      window.removeEventListener("sku:change", onChange as EventListener)
      window.removeEventListener("sku:reset", onReset as EventListener)
    }
  }, [productSlug, productName, initialSkuLabel, initialSkuCode, initialImage, initialPrice, initialOldPrice])

  const discountPercent = useMemo(() => {
    if (!oldPrice || oldPrice <= price) return null
    return Math.round(((oldPrice - price) / oldPrice) * 100)
  }, [oldPrice, price])

  const priceText = useMemo(() => fmtVnd(price), [price])
  const oldText = useMemo(() => (oldPrice ? fmtVnd(oldPrice) : null), [oldPrice])

  const key = `${productSlug}::${skuCode}`

  const addCurrent = () => {
    addToCart({
      key,
      productSlug,
      productName,
      skuCode,
      skuLabel: label,
      image,
      price,
      oldPrice,
      qty: 1,
    })
  }

  const onOrder = () => {
    if (inStock) addCurrent()
    openCart()
  }

  return (
    <>
      <div className="fixed left-0 right-0 bottom-0 z-[90] pointer-events-none">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

        <div
          className="pointer-events-auto w-fit mx-auto px-3"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
        >
          <div className="relative rounded-2xl min-w-[280px] max-w-[96vw]">
            <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10" />
            <div className="relative rounded-2xl bg-black/60 md:backdrop-blur-md shadow-[0_20px_70px_rgba(0,0,0,0.75)] px-4 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* ✅ căn giữa tên SKU + giá */}
                <div className="min-w-0 flex-1 text-center">
                  <div className="font-semibold text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.35)] leading-snug">
                    {label}
                  </div>

                  <div className="mt-1 flex items-baseline gap-2 flex-wrap justify-center">
                    {typeof discountPercent === "number" && discountPercent > 0 ? (
                      <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-extrabold bg-[#FF3B30] text-white">
                        -{discountPercent}%
                      </span>
                    ) : null}

                    <div className="text-[#FFD66B] font-extrabold drop-shadow-[0_0_26px_rgba(255,214,107,0.85)] whitespace-nowrap">
                      {priceText}
                    </div>

                    {oldText ? <div className="text-white/45 line-through whitespace-nowrap text-sm">{oldText}</div> : null}
                  </div>
                </div>

                <div className="shrink-0 flex items-center ml-auto">
                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={onOrder}
                    className={
                      "rounded-full px-6 py-2.5 font-semibold text-white border transition whitespace-nowrap " +
                      (inStock
                        ? "border-[#FF3B30]/35 bg-[#FF3B30] shadow-[0_0_26px_rgba(255,59,48,0.22)] hover:brightness-105"
                        : "border-white/10 bg-white/10 text-white/50 cursor-not-allowed")
                    }
                  >
                    {inStock ? "Đặt hàng" : "Hết hàng"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: "98px" }} aria-hidden />
    </>
  )
}