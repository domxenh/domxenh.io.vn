"use client"

import { useCallback, useMemo, useState } from "react"
import SkuSelector, { type EdisonSku } from "@/components/product/SkuSelector"

type Props = {
  slug: string
  defaultImage: string
  skusWhite: EdisonSku[]
  skusYellow: EdisonSku[]
  title?: string
  resetText?: string
  compact?: boolean
  maxHeightVh?: number
  whiteButtonText?: string
  yellowButtonText?: string
}

export default function ColorSkuSelectorClient({
  slug,
  defaultImage,
  skusWhite,
  skusYellow,
  title = "Chọn độ dài dây",
  resetText = "Xem ảnh sản phẩm",
  compact,
  maxHeightVh,
  whiteButtonText = "Bóng màu Trắng",
  yellowButtonText = "Bóng màu Vàng",
}: Props) {
  const [tone, setTone] = useState<"white" | "yellow">("white")

  const activeSkus = useMemo(() => (tone === "white" ? skusWhite : skusYellow), [tone, skusWhite, skusYellow])

  const emitDefaults = useCallback(
    (list: EdisonSku[]) => {
      window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: defaultImage } }))

      const sku5m10 =
        list.find((s) => (s.skuCode || "").toLowerCase().includes("5m10")) ||
        list.find((s) => (s.label || "").toLowerCase().includes("5 mét") && (s.label || "").toLowerCase().includes("10 bóng")) ||
        null

      if (!sku5m10) return

      window.dispatchEvent(
        new CustomEvent("sku:change", {
          detail: {
            productSlug: slug,
            skuCode: sku5m10.skuCode,
            label: sku5m10.label,
            image: defaultImage,
            price: sku5m10.price,
            oldPrice: sku5m10.oldPrice ?? null,
          },
        })
      )

      window.dispatchEvent(
        new CustomEvent("edison-sku-change", {
          detail: {
            price: sku5m10.price,
            oldPrice: sku5m10.oldPrice ?? null,
            sku: sku5m10.skuCode,
            label: sku5m10.label,
            image: defaultImage,
          },
        })
      )
    },
    [defaultImage, slug]
  )

  const onSwitch = useCallback(
    (next: "white" | "yellow") => {
      if (next === tone) return
      setTone(next)
      const nextList = next === "white" ? skusWhite : skusYellow
      emitDefaults(nextList)
    },
    [emitDefaults, skusWhite, skusYellow, tone]
  )

  const btnBase = "flex-1 rounded-full px-3 py-2 text-[13px] sm:text-sm font-semibold transition border bg-black/20"
  const btnOn =
    "border-[#FFD66B] text-[#FFD66B] shadow-[0_0_0_1px_rgba(255,214,107,0.22),0_0_22px_rgba(255,214,107,0.16)]"
  const btnOff = "border-white/18 text-white/80 hover:border-[#FFD66B]/55 hover:text-[#FFD66B]"

  return (
    <div className={compact ? "mt-3" : "mt-5"}>
      <div className="mb-2 flex items-center gap-2">
        <button type="button" onClick={() => onSwitch("white")} className={[btnBase, tone === "white" ? btnOn : btnOff].join(" ")}>
          {whiteButtonText}
        </button>

        <button type="button" onClick={() => onSwitch("yellow")} className={[btnBase, tone === "yellow" ? btnOn : btnOff].join(" ")}>
          {yellowButtonText}
        </button>
      </div>

      <SkuSelector
        key={tone}
        slug={slug}
        defaultImage={defaultImage}
        skus={activeSkus}
        title={title}
        resetText={resetText}
        compact={compact}
        maxHeightVh={maxHeightVh}
        hideTopActions // ✅ ẩn 2 nút cũ (giờ đã nằm trong ảnh)
      />
    </div>
  )
}