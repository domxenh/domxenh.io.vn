"use client"

import Link from "next/link"
import Image from "next/image"
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

  const discountPercent =
    showSale && product.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null

  const fmt = (n: number) => n.toLocaleString("vi-VN")

  const imgClass =
    variant === "compact" ? "h-48 sm:h-52" : "h-72 md:h-80"

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Link href={`/san-pham/${product.slug}`}>
        <div className={`product-card text-center relative ${variant === "compact" ? "p-5" : ""}`}>
          <div
            className={`mx-auto relative w-full overflow-hidden rounded-2xl bg-black/20 border border-white/10 ${imgClass}`}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />

            {(badge || (typeof discountPercent === "number" && discountPercent > 0)) && (
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                {badge && (
                  <div className="rounded-full px-3 py-1 text-xs font-semibold bg-black/55 border border-[#FF3B30]/70 text-[#FF3B30] backdrop-blur-md">
                    {badge}
                  </div>
                )}

                {typeof discountPercent === "number" && discountPercent > 0 && (
                  <div className="rounded-full px-3 py-1 text-xs font-semibold bg-[#FF3B30] text-white shadow-[0_0_18px_rgba(255,59,48,0.35)]">
                    -{discountPercent}%
                  </div>
                )}
              </div>
            )}
          </div>

          <h3 className={`mt-5 heading ${variant === "compact" ? "text-base" : "text-xl"}`}>
            {product.name}
          </h3>

          <div className="mt-3 flex items-center justify-center gap-3">
            <p className="price">{fmt(product.price)} đ</p>
            {showSale && (
              <p className="text-white/45 line-through text-sm">
                {fmt(product.oldPrice as number)} đ
              </p>
            )}
          </div>

          <div className="mt-5">
            <button className="btn-brand">Chi Tiết</button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// end code