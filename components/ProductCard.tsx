"use client"

import Link from "next/link"
import { motion } from "framer-motion"

/**
 * TÓM TẮT:
 * - Dùng chung cho Home (compact) & Catalog (default)
 * - Hiển thị: Giá niêm yết + Giá gạch (oldPrice) + badge HOT/SALE + nút Chi Tiết
 */

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

  const fmt = (n: number) => n.toLocaleString("vi-VN")

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Link href={`/san-pham/${product.slug}`}>
        <div className={`product-card text-center relative ${variant === "compact" ? "p-5" : ""}`}>
          {badge && (
            <div
              className={`
                absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-semibold
                ${badge === "HOT"
                  ? "bg-[#FFD66B]/20 border border-[#FFD66B]/35 text-white shadow-[0_0_20px_rgba(255,214,107,0.25)]"
                  : "bg-white/10 border border-white/20 text-white/90"}
              `}
            >
              {badge}
            </div>
          )}

          <div
            className={`mx-auto relative w-full overflow-hidden rounded-2xl bg-black/20 border border-white/10
              ${variant === "compact" ? "h-36" : "h-60"}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
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