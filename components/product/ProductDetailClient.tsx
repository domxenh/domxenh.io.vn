// components/product/ProductDetailClient.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

type ImgItem = { src: string; alt: string }

export default function ProductDetailClient({
  slug,
  name,
  defaultImage,
  extraImages,
}: {
  slug: string
  name: string
  defaultImage: string
  extraImages?: string[]
}) {
  const images: ImgItem[] = useMemo(() => {
    // ✅ luôn đủ 8 ảnh: nếu thiếu ảnh thêm -> lặp ảnh default để không vỡ UI
    const base = [defaultImage, ...(extraImages ?? [])]
    while (base.length < 8) base.push(defaultImage)
    const normalized = base.slice(0, 8).map((s) => encodeURI(s))
    return normalized.map((src, i) => ({
      src,
      alt: `${name} - ${i + 1}`,
    }))
  }, [defaultImage, extraImages, name])

  const [index, setIndex] = useState(0)
  const [activeSrc, setActiveSrc] = useState(images[0]?.src || encodeURI(defaultImage))

  const go = (dir: -1 | 1) => {
    setIndex((prev) => {
      const next = (prev + dir + images.length) % images.length
      setActiveSrc(images[next].src)
      return next
    })
  }

  const pick = (i: number) => {
    const safe = Math.max(0, Math.min(i, images.length - 1))
    setIndex(safe)
    setActiveSrc(images[safe].src)
  }

  // ✅ nghe event đổi ảnh từ SKU
  useEffect(() => {
    const onImg = (e: Event) => {
      const ce = e as CustomEvent<{ image: string }>
      if (!ce.detail?.image) return
      const img = encodeURI(ce.detail.image)
      setActiveSrc(img)
      // không đổi index thumbnail (vì ảnh SKU không nằm trong gallery mặc định)
    }

    const onReset = () => {
      pick(0)
    }

    window.addEventListener("edison-image-change", onImg as EventListener)
    window.addEventListener("edison-sku-reset", onReset as EventListener)

    return () => {
      window.removeEventListener("edison-image-change", onImg as EventListener)
      window.removeEventListener("edison-sku-reset", onReset as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  return (
    <div className="lg:col-span-7">
      {/* Main image (Shopee-like: khung vuông/bo nhẹ) */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
        <div className="relative aspect-square">
          <Image
            src={activeSrc}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority
          />

          {/* Prev/Next */}
          <button
            type="button"
            aria-label="Prev image"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/12 bg-black/35 backdrop-blur px-3 py-2 text-white/90 hover:text-white hover:bg-black/55 transition"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/12 bg-black/35 backdrop-blur px-3 py-2 text-white/90 hover:text-white hover:bg-black/55 transition"
          >
            ›
          </button>
        </div>
      </div>

      {/* Thumbnails (Shopee-like: hàng thumbnail nhỏ) */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img, i) => {
          const active = i === index
          return (
            <button
              key={img.src + i}
              type="button"
              onClick={() => pick(i)}
              className={[
                "relative shrink-0 h-16 w-16 rounded-lg overflow-hidden border",
                active ? "border-[#FFD66B]/55" : "border-white/10",
                "bg-black/20",
              ].join(" ")}
              aria-label={`Thumb ${i + 1}`}
            >
              <Image src={img.src} alt={img.alt} fill sizes="64px" className="object-cover" />
              {active ? <span className="absolute inset-0 ring-2 ring-[#FFD66B]/45" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// end code