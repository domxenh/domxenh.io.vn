"use client"

/**
 * components/Fireflies.tsx
 *
 * TÓM TẮT (Fireflies v5.2 – phát triển, không renew):
 * - GIỮ vibe cũ + nâng cấp: mật độ/độ sáng/xa-gần/burst.
 * - BỔ SUNG variant "products" để dùng cho khu vực sản phẩm (full area, mật độ vừa).
 * - Không đổi cách render (absolute inset-0) để tương thích toàn dự án.
 *
 * Dùng:
 *   <Fireflies variant="hero" />
 *   <Fireflies variant="header" />
 *   <Fireflies variant="products" />
 */

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

type Variant = "hero" | "header" | "products"

type Firefly = {
  id: number
  x: number // %
  y: number // %
  depth: 1 | 2 | 3 // 1 xa, 3 gần
  size: number // px
  blur: number // px
  baseOpacity: number
  driftX: number // px
  driftY: number // px
  driftDuration: number // s
  pulseDuration: number // s
  delay: number // s
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min

function pickDepth(): 1 | 2 | 3 {
  // Nhiều con depth 2–3 hơn để nhìn “dày/đã” như fire cũ
  const r = Math.random()
  if (r < 0.25) return 1
  if (r < 0.70) return 2
  return 3
}

function build(count: number, seedOffset: number, scope: "full" | "top"): Firefly[] {
  const list: Firefly[] = []
  for (let i = 0; i < count; i++) {
    const depth = pickDepth()

    const y = scope === "top" ? rand(0, 85) : rand(0, 100)

    const size =
      depth === 1 ? rand(2.2, 3.8) : depth === 2 ? rand(3.6, 6.0) : rand(5.8, 9.2)

    const blur =
      depth === 1 ? rand(0.2, 1.0) : depth === 2 ? rand(0.3, 1.4) : rand(0.4, 1.8)

    const baseOpacity =
      depth === 1 ? rand(0.28, 0.45) : depth === 2 ? rand(0.40, 0.68) : rand(0.55, 0.90)

    const driftX =
      depth === 1 ? rand(-55, 55) : depth === 2 ? rand(-90, 90) : rand(-130, 130)
    const driftY =
      depth === 1 ? rand(-45, 45) : depth === 2 ? rand(-70, 70) : rand(-110, 110)

    const driftDuration =
      depth === 1 ? rand(8, 12) : depth === 2 ? rand(9, 14) : rand(10, 16)

    const pulseDuration =
      depth === 1 ? rand(2.6, 4.2) : depth === 2 ? rand(2.2, 3.6) : rand(1.8, 3.0)

    const delay = rand(0, 4.0)

    list.push({
      id: seedOffset + i,
      x: rand(0, 100),
      y,
      depth,
      size,
      blur,
      baseOpacity,
      driftX,
      driftY,
      driftDuration,
      pulseDuration,
      delay,
    })
  }
  return list
}

export default function Fireflies({ variant = "hero" }: { variant?: Variant }) {
  // GIỮ thông số cũ, chỉ thêm mode products
  const count = variant === "hero" ? 44 : variant === "products" ? 30 : 18
  const scope: "full" | "top" = variant === "hero" ? "full" : variant === "products" ? "full" : "top"

  const burstChance = variant === "hero" ? 0.75 : variant === "products" ? 0.60 : 0.45

  const fireflies = useMemo(
    () => build(count, variant === "hero" ? 1000 : variant === "products" ? 1500 : 2000, scope),
    [count, variant, scope]
  )

  const [burstId, setBurstId] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    let t: number | undefined

    const tick = () => {
      if (!alive) return
      if (Math.random() < burstChance) {
        const pick = fireflies[Math.floor(Math.random() * fireflies.length)]
        setBurstId(pick?.id ?? null)
        window.setTimeout(() => setBurstId(null), 380)
      }
      t = window.setTimeout(tick, rand(800, 1600))
    }

    tick()
    return () => {
      alive = false
      if (t) window.clearTimeout(t)
    }
  }, [fireflies, burstChance])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {fireflies.map((f) => {
        const isBurst = burstId === f.id
        const glow =
          f.depth === 3
            ? "drop-shadow-[0_0_16px_rgba(255,214,107,0.55)]"
            : f.depth === 2
              ? "drop-shadow-[0_0_10px_rgba(255,214,107,0.35)]"
              : "drop-shadow-[0_0_6px_rgba(255,214,107,0.22)]"

        return (
          <motion.span
            key={f.id}
            className={`absolute rounded-full ${glow}`}
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              filter: `blur(${f.blur}px)`,
              background:
                "radial-gradient(circle, rgba(255,214,107,0.95) 0%, rgba(255,214,107,0.35) 45%, rgba(255,214,107,0.0) 72%)",
            }}
            animate={{
              x: [0, f.driftX, 0, -f.driftX * 0.65, 0],
              y: [0, f.driftY, 0, -f.driftY * 0.65, 0],
              opacity: isBurst
                ? [f.baseOpacity, 1, f.baseOpacity]
                : [f.baseOpacity * 0.78, f.baseOpacity * 1.18, f.baseOpacity * 0.82],
              scale: isBurst ? [1, 1.45, 1] : [1, 1.12, 1],
            }}
            transition={{
              x: { duration: f.driftDuration, repeat: Infinity, ease: "easeInOut", delay: f.delay },
              y: { duration: f.driftDuration, repeat: Infinity, ease: "easeInOut", delay: f.delay },
              opacity: isBurst
                ? { duration: 0.32, ease: "easeOut" }
                : { duration: f.pulseDuration, repeat: Infinity, ease: "easeInOut", delay: f.delay * 0.3 },
              scale: isBurst
                ? { duration: 0.32, ease: "easeOut" }
                : { duration: f.pulseDuration, repeat: Infinity, ease: "easeInOut", delay: f.delay * 0.25 },
            }}
          />
        )
      })}
    </div>
  )
}

// end code