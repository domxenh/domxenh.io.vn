// components/product/ProductDetailClient.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"

type ImgItem = { src: string; alt: string }

export default function ProductDetailClient({
  slug,
  name,
  defaultImage,
  extraImages,
  mobileCompact = false,
}: {
  slug: string
  name: string
  defaultImage: string
  extraImages?: string[]
  mobileCompact?: boolean
}) {
  const images: ImgItem[] = useMemo(() => {
    // ✅ Không nhồi cho đủ 8 (tránh tải/giải mã ảnh dư). Chỉ lấy tối đa 8 ảnh thật.
    const base = [defaultImage, ...(extraImages ?? [])]
    const normalized = base.filter(Boolean).slice(0, 8)
    return normalized.map((src, i) => ({
      src,
      alt: `${name} - ${i + 1}`,
    }))
  }, [defaultImage, extraImages, name])

  const [index, setIndex] = useState(0)
  const [activeSrc, setActiveSrc] = useState(images[0]?.src || defaultImage)

  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([])
  const scrollThumbIntoView = (i: number) => {
    const el = thumbRefs.current[i]
    if (!el) return
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" })
  }

  const go = (dir: -1 | 1) => {
    setIndex((prev) => {
      const next = (prev + dir + images.length) % images.length
      setActiveSrc(images[next].src)
      if (mobileCompact) setTimeout(() => scrollThumbIntoView(next), 0)
      return next
    })
  }

  const pick = (i: number) => {
    const safe = Math.max(0, Math.min(i, images.length - 1))
    setIndex(safe)
    setActiveSrc(images[safe].src)
    if (mobileCompact) setTimeout(() => scrollThumbIntoView(safe), 0)
  }

  useEffect(() => {
    const onImg = (e: Event) => {
      const ce = e as CustomEvent<{ image: string }>
      if (!ce.detail?.image) return
      setActiveSrc(ce.detail.image)
    }
    const onReset = () => {
      pick(0)
      if (mobileCompact) setTimeout(() => scrollThumbIntoView(0), 0)
    }

    window.addEventListener("edison-image-change", onImg as EventListener)
    window.addEventListener("edison-sku-reset", onReset as EventListener)
    return () => {
      window.removeEventListener("edison-image-change", onImg as EventListener)
      window.removeEventListener("edison-sku-reset", onReset as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  if (mobileCompact) {
    return (
      <div className="lg:col-span-7">
        <div className="flex gap-3">
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
            <div className="relative aspect-square">
              <Image
                src={activeSrc}
                alt={name}
                fill
                sizes="(max-width: 1024px) 78vw, 60vw"
                className="object-cover object-top"
                priority={index === 0}
              />

              <button
                type="button"
                aria-label="Prev image"
                onClick={() => go(-1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/12 bg-black/40 md:backdrop-blur-sm px-3 py-2 text-white/90 hover:text-white hover:bg-black/55 transition"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => go(1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/12 bg-black/40 md:backdrop-blur-sm px-3 py-2 text-white/90 hover:text-white hover:bg-black/55 transition"
              >
                ›
              </button>
            </div>
          </div>

          <div className="w-16 shrink-0">
            <div
              className={[
                "flex flex-col gap-2 overflow-auto pr-1 py-1",
                "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              ].join(" ")}
              style={{ maxHeight: "calc(78vw + 10px)" }}
            >
              {images.map((img, i) => {
                const active = i === index
                return (
                  <button
                    key={img.src + i}
                    ref={(el) => {
                      thumbRefs.current[i] = el
                    }}
                    type="button"
                    onClick={() => pick(i)}
                    className={[
                      "relative shrink-0 rounded-lg overflow-hidden border bg-black/20",
                      "h-16 w-16",
                      active ? "border-[#FFD66B]/55" : "border-white/10",
                    ].join(" ")}
                    aria-label={`Thumb ${i + 1}`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                    {active ? <span className="absolute inset-0 ring-2 ring-[#FFD66B]/45" /> : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:col-span-7">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
        <div className="relative aspect-square">
          <Image
            src={activeSrc}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority={index === 0}
          />

          <button
            type="button"
            aria-label="Prev image"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/12 bg-black/40 md:backdrop-blur-sm px-3 py-2 text-white/90 hover:text-white hover:bg-black/55 transition"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full border border-white/12 bg-black/40 md:backdrop-blur-sm px-3 py-2 text-white/90 hover:text-white hover:bg-black/55 transition"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img, i) => {
          const active = i === index
          return (
            <button
              key={img.src + i}
              type="button"
              onClick={() => pick(i)}
              className={[
                "relative shrink-0 rounded-lg overflow-hidden border",
                "h-16 w-16",
                active ? "border-[#FFD66B]/55" : "border-white/10",
                "bg-black/20",
              ].join(" ")}
              aria-label={`Thumb ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
              />
              {active ? <span className="absolute inset-0 ring-2 ring-[#FFD66B]/45" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}