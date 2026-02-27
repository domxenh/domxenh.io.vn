"use client"

/**
 * Version 2.0 – https://github.com/domxenh/domxenh.io.vn/blob/main/components/product/ProductQuickViewProvider.tsx
 * components/product/ProductQuickViewProvider.tsx 
 *
 * TÓM TẮT:
 * - Tạo Quick View modal mở ngay trên trang (Home + Catalog).
 * - Cung cấp context: open(product) / close()
 * - Modal đóng bằng: click overlay, nút X, phím ESC.
 * - Giữ nhẹ nhàng: chỉ render modal khi cần.
 */

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"

export type QuickViewProduct = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  oldPrice?: number | null
  isHot?: boolean | null
  description?: string | null
}

type Ctx = {
  open: (p: QuickViewProduct) => void
  close: () => void
}

const ProductQuickViewContext = createContext<Ctx | null>(null)

export function useProductQuickView() {
  const ctx = useContext(ProductQuickViewContext)
  if (!ctx) throw new Error("useProductQuickView must be used inside <ProductQuickViewProvider />")
  return ctx
}

function fmtVND(n: number) {
  return n.toLocaleString("vi-VN")
}

export default function ProductQuickViewProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<QuickViewProduct | null>(null)

  const close = useCallback(() => setProduct(null), [])
  const open = useCallback((p: QuickViewProduct) => setProduct(p), [])

  // ESC để đóng
  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [product, close])

  // Lock scroll khi mở modal
  useEffect(() => {
    if (!product) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [product])

  const value = useMemo(() => ({ open, close }), [open, close])

  const showSale = !!product && typeof product.oldPrice === "number" && product.oldPrice > product.price
  const discountPercent =
    product && showSale ? Math.round(((product.oldPrice as number) - product.price) / (product.oldPrice as number) * 100) : 0

  return (
    <ProductQuickViewContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {product && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <button aria-label="Đóng" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="
                relative w-full max-w-3xl overflow-hidden
                rounded-[28px] border border-white/12
                bg-gradient-to-b from-[#0F1F23]/95 to-[#0B1417]/95
                shadow-[0_40px_140px_rgba(0,0,0,0.75)]
              "
              initial={{ y: 20, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 16, scale: 0.985, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {/* Glow decor */}
              <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-[#FFD66B]/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#0F5C63]/12 blur-3xl" />

              {/* Close */}
              <button
                onClick={close}
                aria-label="Đóng"
                className="
                  absolute top-3 right-3 z-10
                  h-10 w-10 rounded-full
                  border border-white/12 bg-white/5
                  text-white/85 hover:bg-white/10
                "
              >
                ✕
              </button>

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative">
                  <div className="relative aspect-square w-full bg-black/25">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Badges (HOT + -% cạnh nhau, to hơn & nổi bật hơn) */}
                  <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
                    {product.isHot && (
                      <span
                        className="
                          inline-flex items-center justify-center
                          rounded-full px-3.5 py-1.5
                          text-xs md:text-sm font-extrabold tracking-wide
                          bg-[#FFD66B] text-black
                          shadow-[0_14px_40px_rgba(0,0,0,0.55)]
                          ring-2 ring-white/35
                          drop-shadow-[0_0_16px_rgba(255,214,107,0.55)]
                        "
                      >
                        HOT
                      </span>
                    )}

                    {showSale && (
                      <span
                        className="
                          inline-flex items-center justify-center
                          rounded-full px-3.5 py-1.5
                          text-xs md:text-sm font-extrabold tracking-wide
                          bg-red-600 text-white
                          shadow-[0_14px_40px_rgba(0,0,0,0.55)]
                          ring-2 ring-white/25
                          drop-shadow-[0_0_18px_rgba(255,40,40,0.35)]
                        "
                      >
                        -{discountPercent}%
                      </span>
                    )}

                    {/* Nếu không HOT mà có sale, muốn hiện SALE cạnh -% */}
                    {!product.isHot && showSale && (
                      <span
                        className="
                          inline-flex items-center justify-center
                          rounded-full px-3.5 py-1.5
                          text-xs md:text-sm font-extrabold tracking-wide
                          bg-white/14 text-white
                          shadow-[0_14px_40px_rgba(0,0,0,0.55)]
                          ring-2 ring-white/20
                        "
                      >
                        SALE
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-7">
                  <h3 className="text-xl md:text-2xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.18)]">
                    {product.name}
                  </h3>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div className="flex items-end gap-3">
                      {showSale && (
                        <div className="text-white/45 line-through text-sm">{fmtVND(product.oldPrice as number)} đ</div>
                      )}

                      <div className="text-[#FFD66B] text-2xl font-bold drop-shadow-[0_0_18px_rgba(255,214,107,0.35)]">
                        {fmtVND(product.price)} đ
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-white/70 leading-relaxed">
                    {product.description || "Mô tả sản phẩm đang được cập nhật."}
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/san-pham/${product.slug}`}
                      className="
                        inline-flex items-center justify-center
                        rounded-full px-5 py-3
                        border border-white/12 bg-white/5 text-white/90
                        hover:bg-white/10
                      "
                      onClick={close}
                      prefetch={false}
                    >
                      Xem trang sản phẩm
                    </Link>

                    <button
                      className="btn-brand"
                      onClick={() => {
                        // TODO: sau này gắn Zalo / Giỏ hàng
                        close()
                      }}
                    >
                      Mua / Tư vấn nhanh
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-white/45">Tip: bấm ra ngoài hoặc nhấn ESC để đóng.</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProductQuickViewContext.Provider>
  )
}

// end code