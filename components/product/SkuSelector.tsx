// components/product/SkuSelector.tsx
"use client"

import { useMemo, useRef, useState } from "react"

export type EdisonSku = {
  label: string
  skuCode: string
  sku?: string
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

type EdisonChangeDetail = {
  price: number
  oldPrice: number | null
  sku: string
  label: string
  image?: string
}

export default function SkuSelector({
  defaultImage,
  skus,
  slug,
  title = "Chọn độ dài dây",
  resetText = "Xem ảnh sản phẩm",
  compact = false,
  maxHeightVh,
}: {
  defaultImage: string
  skus: EdisonSku[]
  slug: string
  title?: string
  resetText?: string
  compact?: boolean
  maxHeightVh?: number
}) {
  const [activeCode, setActiveCode] = useState("") // selected thật
  const [focusCode, setFocusCode] = useState("") // focus/preview (không chọn)

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

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const emitAll = (detail: SkuChangeDetail) => {
    window.dispatchEvent(new CustomEvent("sku:change", { detail }))

    const ed: EdisonChangeDetail = {
      price: detail.price,
      oldPrice: detail.oldPrice ?? null,
      sku: detail.skuCode,
      label: detail.label,
      image: detail.image,
    }
    window.dispatchEvent(new CustomEvent("edison-sku-change", { detail: ed }))
    window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: detail.image } }))
  }

  const selectSkuByCode = (skuCode: string) => {
    setFocusCode("")
    setActiveCode(skuCode)

    const found = normalized.find((s) => s.skuCode === skuCode)
    if (!found) return

    emitAll({
      productSlug: slug,
      skuCode: found.skuCode,
      label: found.label,
      image: found.image,
      price: found.price,
      oldPrice: found.oldPrice,
    })
  }

  const findSku5m10 = () => {
    return (
      normalized.find((s) => s.skuCode === "edison 5m10") ||
      normalized.find((s) => s.label.toLowerCase().includes("5 mét") && s.label.toLowerCase().includes("10 bóng")) ||
      null
    )
  }

  const onViewProductImage = () => {
    // bỏ chọn SKU cũ
    setActiveCode("")

    // đổi ảnh về thumb #1
    const productThumb1 = "/images/edison/thumb/edison/1.webp"
    window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: productThumb1 } }))

    const sku = findSku5m10()
    if (!sku) return

    // focus (không chọn)
    setFocusCode(sku.skuCode)

    const el = itemRefs.current[sku.skuCode]
    if (el) el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" })

    // đổi tên + giá sang 5m10 (không chọn)
    emitAll({
      productSlug: slug,
      skuCode: sku.skuCode,
      label: sku.label,
      image: productThumb1,
      price: sku.price,
      oldPrice: sku.oldPrice,
    })
  }

  if (normalized.length === 0) return null

  const wrapClass = compact
    ? "mt-3 rounded-2xl border border-white/10 bg-white/5 p-3"
    : "mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"

  const titleClass = compact
    ? "font-semibold text-sm text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.85)]"
    : "font-semibold text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.85)]"

  const resetClass = compact
    ? "text-[12px] font-semibold text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.9)] hover:brightness-110 transition border border-[#FFD66B]/20 bg-black/20 rounded-full px-3 py-1.5"
    : "text-sm font-semibold text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.9)] hover:brightness-110 transition border border-[#FFD66B]/20 bg-black/20 rounded-full px-3.5 py-1.5"

  const listStyle = maxHeightVh ? ({ maxHeight: `${maxHeightVh}vh` } as const) : undefined

  return (
    <div className={wrapClass}>
      <div className="flex items-center justify-between gap-3">
        <div className={titleClass}>{title}</div>
        <button type="button" onClick={onViewProductImage} className={resetClass}>
          {resetText}
        </button>
      </div>

      <div
        className={[
          "mt-3 grid grid-cols-2 gap-2",
          "sm:grid-cols-3",
          "lg:flex lg:flex-wrap lg:gap-2",
          maxHeightVh ? "overflow-auto pr-1" : "",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        ].join(" ")}
        style={listStyle}
      >
        {normalized.map((s) => {
          const selected = s.skuCode === activeCode
          const focused = !selected && s.skuCode === focusCode

          const labelClass =
            selected || focused
              ? "text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.95)]"
              : "text-white/95"

          // ✅ mọi viền “chọn/focus” đều vàng
          const borderClass = selected
            ? "border-[#FFD66B]/85 bg-[#FFD66B]/8 shadow-[0_0_22px_rgba(255,214,107,0.18)]"
            : focused
            ? "border-[#FFD66B]/70 bg-[#FFD66B]/5 shadow-[0_0_22px_rgba(255,214,107,0.18)]"
            : "border-white/12 hover:bg-white/5"

          return (
            <button
              key={s.skuCode}
              ref={(el) => {
                itemRefs.current[s.skuCode] = el
              }}
              type="button"
              onClick={() => selectSkuByCode(s.skuCode)}
              className={["text-left rounded-xl border transition bg-black/20 px-3 py-2", borderClass].join(" ")}
            >
              <div className={["font-semibold", compact ? "text-[13px] leading-snug" : "text-sm", labelClass].join(" ")}>
                {s.label}
              </div>

              {compact ? null : <div className="mt-0.5 text-white/55 text-xs">{s.skuCode}</div>}
            </button>
          )
        })}
      </div>
    </div>
  )
}