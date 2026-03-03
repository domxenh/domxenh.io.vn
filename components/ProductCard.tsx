"use client"

import Link from "next/link"
import Image from "next/image"

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
  disableMotion = false,
}: {
  product: ProductLike
  variant?: "default" | "compact"
  disableMotion?: boolean
}) {
  const showSale =
    typeof product.oldPrice === "number" && product.oldPrice > product.price

  const badge = product.isHot ? "HOT" : showSale ? "SALE" : null

  const discountPercent =
    showSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null

  const fmt = (n: number) => n.toLocaleString("vi-VN")
  const imgClass = variant === "compact" ? "h-48 sm:h-52" : "h-72 md:h-80"

  const badgeClass =
    "rounded-full px-3 py-1.5 text-[12px] font-extrabold tracking-wide " +
    "bg-black/55 border border-[#FF3B30]/55 text-[#FF3B30] " +
    "shadow-[0_0_18px_rgba(255,59,48,0.30)] md:backdrop-blur-sm"

  const Card = (
    <Link href={`/san-pham/${product.slug}`} className="block">
      <div
        className={[
          "product-card relative",
          "flex flex-col items-center text-center",
          variant === "compact" ? "p-5" : "",
        ].join(" ")}
      >
        {/* Image */}
        <div
          className={[
            "mx-auto relative w-full overflow-hidden rounded-2xl",
            "bg-black/20 border border-white/10",
            imgClass,
          ].join(" ")}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />

          {badge ? (
            <div className="absolute left-3 bottom-3 z-10">
              <span className={badgeClass}>{badge}</span>
            </div>
          ) : null}
        </div>

        {/* Content */}
        <div className="mt-5 w-full flex flex-col items-center">
          <div className="min-h-[2.7em] flex items-center justify-center">
            <h3
              className={[
                "heading",
                variant === "compact" ? "text-base" : "text-xl",
                "text-[#FFD66B]",
                "drop-shadow-[0_0_30px_rgba(255,214,107,0.85)]",
                "leading-snug line-clamp-2",
              ].join(" ")}
            >
              {product.name}
            </h3>
          </div>

          <div className="mt-3 flex flex-wrap items-baseline justify-center gap-2 min-h-[28px]">
            {typeof discountPercent === "number" && discountPercent > 0 ? (
              <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold bg-[#FF3B30] text-white shadow-[0_0_18px_rgba(255,59,48,0.35)]">
                -{discountPercent}%
              </span>
            ) : null}

            <p
              className={[
                "price",
                "font-extrabold",
                "text-[#FFD66B] whitespace-nowrap",
                "drop-shadow-[0_0_32px_rgba(255,214,107,0.95)]",
              ].join(" ")}
            >
              {fmt(product.price)} đ
            </p>

            {showSale ? (
              <p className="text-white/45 line-through text-sm whitespace-nowrap">
                {fmt(product.oldPrice as number)} đ
              </p>
            ) : (
              <span className="text-sm opacity-0 whitespace-nowrap">0 đ</span>
            )}
          </div>
        </div>

        {/* ✅ FIX: không dùng button trong Link */}
        <div className="mt-5">
          <span className="btn-brand inline-flex items-center justify-center">
            Chi Tiết
          </span>
        </div>
      </div>
    </Link>
  )

  if (disableMotion) return Card

  // ✅ thay framer-motion bằng CSS transform (nhẹ hơn nhiều)
  return <div className="transition-transform duration-300 hover:scale-[1.02]">{Card}</div>
}