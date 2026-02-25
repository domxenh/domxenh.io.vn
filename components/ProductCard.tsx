"use client"

import { motion } from "framer-motion"
import { useProductQuickView } from "@/components/product/ProductQuickViewProvider"

type ProductLike = {
  id?: string
  slug: string
  name: string
  image: string
  price: number
  oldPrice?: number | null
  isHot?: boolean | null
  description?: string | null
}

export default function ProductCard({
  product,
  variant = "default",
}: {
  product: ProductLike
  variant?: "default" | "compact"
}) {
  const { open } = useProductQuickView()

  const showSale =
    typeof product.oldPrice === "number" && product.oldPrice > product.price

  const badge = product.isHot ? "HOT" : showSale ? "SALE" : null

  const discountPct = showSale
    ? Math.round(
        (((product.oldPrice as number) - product.price) /
          (product.oldPrice as number)) *
          100
      )
    : null

  const fmt = (n: number) => n.toLocaleString("vi-VN")

  // ✅ chỉnh tay gap giá -> nút (px)
  const PRICE_TO_BUTTON_GAP_PX = 14

  // ✅ xuống dòng thông minh: ngắt sau "Bộ dây đèn"
  const smartSplitName = (name: string) => {
    const key = "Bộ dây đèn"
    const idx = name.indexOf(key)
    if (idx === -1) return { line1: null as string | null, line2: null as string | null }
    const after = name.slice(idx + key.length).trim()
    if (!after) return { line1: null, line2: null }
    return { line1: key, line2: after }
  }
  const split = smartSplitName(product.name)

  const openQuickView = () =>
    open({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      oldPrice: product.oldPrice,
      isHot: product.isHot,
      description: product.description ?? null,
    })

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="w-full">
      <div
        className={`
          product-card text-center relative
          w-full h-full flex flex-col
          mx-auto
          ${variant === "compact" ? "max-w-[240px]" : ""}
        `}
      >
        {/* Badge trái */}
        {badge && (
          <div
            className={`
              absolute top-3 left-3 z-10
              rounded-full px-2.5 py-1 text-[10px] md:text-[11px]
              font-extrabold tracking-wide uppercase
              shadow-[0_10px_25px_rgba(0,0,0,0.6)]
              ring-1 ring-white/20 backdrop-blur
              ${badge === "HOT" ? "bg-[#FFD66B] text-black" : "bg-red-500 text-white"}
            `}
          >
            {badge}
          </div>
        )}

        {/* Badge phải: -% */}
        {typeof discountPct === "number" && discountPct > 0 && (
          <div
            className="
              absolute top-3 right-3 z-10
              rounded-full px-2.5 py-1
              text-[10px] md:text-[11px]
              font-extrabold
              bg-red-600 text-white
              shadow-[0_10px_25px_rgba(0,0,0,0.6)]
              ring-1 ring-white/15
            "
          >
            -{discountPct}%
          </div>
        )}

        {/* Ảnh (click mở modal) */}
        <button
          type="button"
          onClick={openQuickView}
          className="mx-auto relative w-full aspect-square overflow-hidden rounded-2xl bg-black/20 border border-white/10"
          aria-label={`Xem nhanh ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover rounded-2xl"
          />
        </button>

        {/* Tên (click mở modal) */}
        <button
          type="button"
          onClick={openQuickView}
          className="mt-3 block w-full"
          aria-label={`Xem nhanh ${product.name}`}
          title={product.name}
        >
          {split.line1 ? (
            <div className="w-full text-center">
              <p
                className={`
                  heading leading-snug
                  ${variant === "compact" ? "text-base md:text-lg font-semibold" : "text-lg md:text-xl"}
                  mx-auto max-w-full text-center truncate
                `}
              >
                {split.line1}
              </p>
              <p
                className={`
                  heading leading-snug
                  ${variant === "compact" ? "text-base md:text-lg font-semibold" : "text-lg md:text-xl"}
                  mx-auto max-w-full text-center truncate
                `}
              >
                {split.line2}
              </p>
            </div>
          ) : (
            <h3
              className={`
                heading leading-snug
                ${variant === "compact" ? "text-base md:text-lg font-semibold" : "text-lg md:text-xl"}
                mx-auto max-w-full text-center
              `}
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                overflow: "hidden",
              }}
            >
              {product.name}
            </h3>
          )}
        </button>

        {/* Giá */}
        <div className="mt-2 flex w-full flex-nowrap items-baseline justify-between gap-3 px-0">
          {showSale ? (
            <p className="whitespace-nowrap text-xs md:text-sm text-white/55 line-through text-left">
              {fmt(product.oldPrice as number)} đ
            </p>
          ) : (
            <span />
          )}

          <p
            className="
              whitespace-nowrap text-base md:text-lg font-extrabold
              text-[#FFD66B] text-right ml-auto
              drop-shadow-[0_0_10px_rgba(255,214,107,0.55)]
            "
          >
            {fmt(product.price)} đ
          </p>
        </div>

        {/* Nút Chi Tiết => mở modal */}
        <div
          className="mt-auto pt-[var(--gap)] pb-0"
          style={{ ["--gap" as any]: `${PRICE_TO_BUTTON_GAP_PX}px` }}
        >
          <button
            type="button"
            onClick={openQuickView}
            className="btn-brand inline-flex items-center justify-center"
          >
            Chi Tiết
          </button>
        </div>
      </div>
    </motion.div>
  )
}