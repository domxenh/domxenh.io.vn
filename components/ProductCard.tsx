// version V2.1 https://github.com/domxenh/domxenh.io.vn/blob/main/components/ProductCard.tsx

"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { useProductQuickView } from "@/components/product/ProductQuickViewProvider"

type ProductLike = {
  id?: string
  slug: string
  name: string
  image: string
  price: number
  oldPrice?: number | null
  isHot?: boolean | null
  // ✅ phát triển thêm (không ảnh hưởng cũ): nếu có description thì modal dùng được
  description?: string | null
}

export default function ProductCard({
  product,
  variant = "default",
}: {
  product: ProductLike
  variant?: "default" | "compact"
}) {
  const reduceMotion = useReducedMotion()

  // ✅ NEW: dùng Quick View (không phá cấu trúc cũ)
  const { open } = useProductQuickView()

  // ✅ mobile detect để tắt hover scale (mượt hơn khi scroll/tap)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener?.("change", apply)
    return () => mq.removeEventListener?.("change", apply)
  }, [])

  const showSale =
    typeof product.oldPrice === "number" && product.oldPrice > product.price

  const badge = product.isHot ? "HOT" : showSale ? "SALE" : null

  const discountPct = showSale
    ? Math.round(
        (((product.oldPrice as number) - product.price) / (product.oldPrice as number)) * 100
      )
    : null

  const fmt = (n: number) => n.toLocaleString("vi-VN")

  const NAME_TO_PRICE_GAP = "mt-2" // giữ nguyên như file gốc của bạn
  const PRICE_TO_BUTTON_GAP_PX = 10

  return (
    <motion.div
      whileHover={!reduceMotion && !isMobile ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.22 }}
      className="w-full"
    >
      {/* ✅ tắt prefetch để giảm lag trên mobile khi có nhiều card */}
      <Link href={`/san-pham/${product.slug}`} prefetch={false}>
        <div
          className={`
            product-card text-center relative
            w-full h-full flex flex-col
            mx-auto
            ${variant === "compact" ? "max-w-[240px] p-4" : ""}
          `}
        >
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

          <div
            className="
              mx-auto relative w-full
              aspect-square
              overflow-hidden rounded-2xl
              bg-black/20 border border-white/10
            "
          >
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* giữ nguyên cấu trúc title của bạn */}
          <div
            className={`
              mt-3 w-full hide-scrollbar
              whitespace-nowrap
              overflow-x-auto
              scroll-smooth
              pb-1
              ${variant === "compact" ? "text-base md:text-lg font-semibold" : "text-lg md:text-xl"}
            `}
            title={product.name}
            style={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <span className="heading inline-block pr-2">{product.name}</span>
          </div>

          <div className={`${NAME_TO_PRICE_GAP} flex w-full flex-nowrap items-baseline justify-between gap-3`}>
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

          <div
            className="mt-auto pt-[var(--gap)]"
            style={{ ["--gap" as any]: `${PRICE_TO_BUTTON_GAP_PX}px` }}
          >
            {/* ✅ NEW: bấm Chi Tiết mở QuickView, không đi trang */}
            <button
              className="btn-brand"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                open(product as any)
              }}
            >
              Chi Tiết
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}