"use client"

import Link from "next/link"
import { motion } from "framer-motion"

type ProductLike = {
  id?: string
  slug: string
  name: string
  image: string
  price: number
  oldPrice?: number | null
  isHot?: boolean | null
}

export default function ProductCard({
  product,
  variant = "default",
}: {
  product: ProductLike
  variant?: "default" | "compact"
}) {
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

  // ✅ CHỈNH TAY Ở ĐÂY:
  // khoảng cách TÊN -> GIÁ (đổi mt-1/mt-2/mt-3...)
  const NAME_TO_PRICE_GAP_CLASS = "mt-1"

  // ✅ CHỈNH TAY Ở ĐÂY (px): khoảng cách GIÁ -> NÚT
  const PRICE_TO_BUTTON_GAP_PX = 15

  // ✅ Xuống dòng thông minh: ngắt ngay sau "Bộ dây đèn"
  const smartSplitName = (name: string) => {
    const key = "Bộ dây đèn"
    const idx = name.indexOf(key)
    if (idx === -1) return { line1: null as string | null, line2: null as string | null }

    const after = name.slice(idx + key.length).trim()
    if (!after) return { line1: null, line2: null }

    return { line1: key, line2: after }
  }

  const split = smartSplitName(product.name)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Link href={`/san-pham/${product.slug}`}>
        <div
          className={`
            product-card text-center relative
            w-full h-full flex flex-col
            mx-auto
            ${variant === "compact" ? "max-w-[240px] pt-4 px-4 pb-2" : ""}
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
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>

          {/* ✅ TÊN 2 DÒNG - XUỐNG DÒNG THÔNG MINH SAU "Bộ dây đèn" */}
          {/* ✅ TÊN 2 DÒNG - CĂN GIỮA KHI RESIZE */}
          {split.line1 ? (
            <div className="mt-3 w-full text-center" title={product.name}>
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
                mt-3 heading leading-snug
                ${variant === "compact" ? "text-base md:text-lg font-semibold" : "text-lg md:text-xl"}
                mx-auto max-w-full text-center
              `}
              title={product.name}
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

          {/* ✅ KHOẢNG CÁCH TÊN -> GIÁ (chỉnh tay bằng NAME_TO_PRICE_GAP_CLASS) */}
          <div
            className={`${NAME_TO_PRICE_GAP_CLASS} flex w-full flex-nowrap items-baseline justify-between gap-3`}
          >
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

          {/* ✅ KHOẢNG CÁCH GIÁ -> NÚT (chỉnh tay bằng PRICE_TO_BUTTON_GAP_PX) */}
          <div
            className="mt-auto pt-[var(--gap)] pb-0"
            style={{ ["--gap" as any]: `${PRICE_TO_BUTTON_GAP_PX}px` }}
          >
            <button className="btn-brand">Chi Tiết</button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}