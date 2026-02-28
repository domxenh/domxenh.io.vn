"use client"

import React, { createContext, useContext, useMemo, useState } from "react"
import Link from "next/link"

export type QuickViewProduct = {
  id?: string
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
  if (!ctx) throw new Error("useProductQuickView must be used within ProductQuickViewProvider")
  return ctx
}

export default function ProductQuickViewProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [product, setProduct] = useState<QuickViewProduct | null>(null)

  const open = (p: QuickViewProduct) => {
    setProduct(p)
    setIsOpen(true)
    document.documentElement.style.overflow = "hidden"
  }

  const close = () => {
    setIsOpen(false)
    document.documentElement.style.overflow = ""
    setTimeout(() => setProduct(null), 150)
  }

  const value = useMemo(() => ({ open, close }), [])

  return (
    <ProductQuickViewContext.Provider value={value}>
      {children}

      {isOpen && product && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
            aria-label="Đóng"
          />

          {/* Panel */}
          <div
            className="
              relative z-[81] w-full max-w-3xl
              rounded-[28px] border border-white/10
              bg-gradient-to-b from-white/10 to-white/5
              shadow-[0_40px_140px_rgba(0,0,0,0.75)]
              backdrop-blur-2xl
              overflow-hidden
            "
          >
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFD66B]/10 blur-3xl" />

            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white truncate">{product.name}</h3>
                  <p className="mt-1 text-white/60 text-sm">Xem nhanh chi tiết sản phẩm</p>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="
                    shrink-0 rounded-full px-3 py-2
                    text-white/80 hover:text-white
                    bg-white/10 hover:bg-white/15
                    border border-white/10
                  "
                >
                  Đóng
                </button>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Image */}
                <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                  <div className="aspect-square w-full">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      {typeof product.oldPrice === "number" && product.oldPrice > product.price ? (
                        <p className="text-white/55 line-through text-sm whitespace-nowrap">
                          {product.oldPrice.toLocaleString("vi-VN")} đ
                        </p>
                      ) : (
                        <span />
                      )}

                      <p
                        className="
                          text-[#FFD66B] font-extrabold text-lg whitespace-nowrap
                          drop-shadow-[0_0_10px_rgba(255,214,107,0.55)]
                        "
                      >
                        {product.price.toLocaleString("vi-VN")} đ
                      </p>
                    </div>

                    {product.description ? (
                      <p className="mt-3 text-white/70 text-sm leading-relaxed">{product.description}</p>
                    ) : (
                      <p className="mt-3 text-white/50 text-sm">(Chưa có mô tả)</p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button className="btn-brand w-full sm:w-auto" type="button">
                      Liên hệ mua
                    </button>

                    {/* nếu vẫn muốn giữ trang chi tiết cho SEO */}
                    <Link
                      href={`/san-pham/${product.slug}`}
                      className="
                        w-full sm:w-auto text-center
                        rounded-full px-5 py-3
                        bg-white/10 hover:bg-white/15
                        border border-white/10
                        text-white font-semibold
                      "
                    >
                      Xem trang chi tiết
                    </Link>
                  </div>

                  <div className="mt-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProductQuickViewContext.Provider>
  )
}