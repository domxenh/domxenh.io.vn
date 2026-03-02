// components/product/SkuSelector.tsx
"use client"

import { useMemo, useState } from "react"

export type EdisonSku = {
  label: string
  skuCode: string // ✅ bắt buộc
  sku?: string // legacy (nếu nơi khác còn dùng)
  image: string
  price: number
  oldPrice: number | null
}

type SkuChangeDetail = {
  productSlug: string
  skuCode: string
  label: string
  image: string
  price: number
  oldPrice: number | null
}

export default function SkuSelector({
  defaultImage,
  skus,
  slug,
  title = "Chọn phiên bản (SKU)",
  resetText = "Xem ảnh sản phẩm",
}: {
  defaultImage: string
  skus: EdisonSku[]
  slug: string
  title?: string
  resetText?: string
}) {
  const [activeCode, setActiveCode] = useState("")

  const normalized = useMemo(() => {
    return (skus || [])
      .map((s) => ({
        label: s.label,
        skuCode: (s.skuCode || s.sku || "").trim(),
        image: s.image,
        price: s.price,
        oldPrice: s.oldPrice ?? null,
      }))
      .filter((s) => s.skuCode && s.label)
  }, [skus])

  const emitChange = (detail: SkuChangeDetail) => {
    // event chung
    window.dispatchEvent(new CustomEvent("sku:change", { detail }))

    // giữ tương thích cũ nếu nơi khác còn nghe
    window.dispatchEvent(
      new CustomEvent("edison-sku-change", {
        detail: {
          image: detail.image,
          price: detail.price,
          oldPrice: detail.oldPrice,
          sku: detail.skuCode,
          label: detail.label,
        },
      })
    )
    window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: detail.image } }))
  }

  const emitReset = () => {
    window.dispatchEvent(new CustomEvent("sku:reset", { detail: { productSlug: slug } }))
    window.dispatchEvent(new CustomEvent("edison-sku-reset"))
    window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: defaultImage } }))
  }

  const selectSku = (skuCode: string) => {
    setActiveCode(skuCode)
    const found = normalized.find((s) => s.skuCode === skuCode)
    if (!found) return
    emitChange({
      productSlug: slug,
      skuCode: found.skuCode,
      label: found.label,
      image: found.image,
      price: found.price,
      oldPrice: found.oldPrice,
    })
  }

  if (normalized.length === 0) return null

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-white font-semibold">{title}</div>
        <button
          type="button"
          onClick={emitReset}
          className="text-xs text-white/80 hover:text-white transition border border-white/10 bg-black/20 rounded-full px-3 py-1.5"
        >
          {resetText}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {normalized.map((s) => {
          const selected = s.skuCode === activeCode
          return (
            <button
              key={s.skuCode}
              type="button"
              onClick={() => selectSku(s.skuCode)}
              className={[
                "text-left rounded-lg border px-3 py-2 transition",
                "bg-black/20",
                "min-w-[132px] sm:min-w-[160px]",
                selected
                  ? "border-[#FF3B30] bg-[#FF3B30]/10 shadow-[0_0_18px_rgba(255,59,48,0.18)]"
                  : "border-white/12 hover:bg-white/5",
              ].join(" ")}
            >
              <div className="text-white/95 font-semibold text-sm">{s.label}</div>
              <div className="mt-0.5 text-white/55 text-xs">{s.skuCode}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// end code