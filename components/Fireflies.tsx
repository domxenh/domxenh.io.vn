"use client"

/**
 * components/Fireflies.tsx
 *
 * TÓM TẮT (Fireflies v5.1 – giữ vibe cũ nhưng nâng cấp):
 * - Mật độ cao hơn + sáng hơn (đỡ “mờ/ít”).
 * - Có xa/gần: con gần to, sáng, glow mạnh; con xa nhỏ, nhẹ blur.
 * - Thỉnh thoảng flash ngẫu nhiên 1 cái (burst), không đồng loạt.
 * - Dùng chung Hero/Header:
 *   <Fireflies variant="hero" />
 *   <Fireflies variant="header" />
 */

import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

type Variant = "hero" | "header"

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

    // scope: header/top => tập trung y gần phía trên, để giống “lan lên header”
    const y =
      scope === "top"
        ? rand(0, 85) // tập trung vùng trên
        : rand(0, 100)

    // Đậm hơn bản trước (để không mờ)
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
      depth === 1 ? rand(11, 18) : depth === 2 ? rand(9, 15) : rand(7, 12)

    const pulseDuration =
      depth === 1 ? rand(3.8, 6.8) : depth === 2 ? rand(3.0, 5.6) : rand(2.4, 4.8)

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
      delay: rand(0, 4.5),
    })
  }
  return list
}

export default function Fireflies({ variant = "hero" }: { variant?: Variant }) {
  // Dày hơn rõ rệt (như vibe cũ)
  const count = variant === "hero" ? 44 : 18
  const scope: "full" | "top" = variant === "hero" ? "full" : "top"

  // Flash: hero nhiều hơn, header ít hơn
  const burstChance = variant === "hero" ? 0.75 : 0.45

  const fireflies = useMemo(
    () => build(count, variant === "hero" ? 1000 : 2000, scope),
    [count, variant, scope]
  )

  const [burstId, setBurstId] = useState<number | null>(null)

  // Burst ngẫu nhiên theo nhịp
  useEffect(() => {
    let alive = true
    let t: number | undefined

    const schedule = () => {
      const next = rand(900, 1800) // flash thường xuyên hơn để “có điểm nhấn”
      t = window.setTimeout(() => {
        if (!alive) return
        if (Math.random() < burstChance) {
          const pick = fireflies[Math.floor(Math.random() * fireflies.length)]
          setBurstId(pick?.id ?? null)

          window.setTimeout(() => {
            if (alive) setBurstId(null)
          }, rand(220, 360))
        }
        schedule()
      }, next)
    }

    schedule()
    return () => {
      alive = false
      if (t) window.clearTimeout(t)
    }
  }, [fireflies, burstChance])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {fireflies.map((f) => {
        const isBurst = burstId === f.id

        // Glow “đã” hơn (đỡ mờ)
        const glowA =
          f.depth === 1
            ? "drop-shadow-[0_0_10px_rgba(255,214,107,0.65)]"
            : f.depth === 2
              ? "drop-shadow-[0_0_16px_rgba(255,214,107,0.85)]"
              : "drop-shadow-[0_0_22px_rgba(255,214,107,1)]"

        const glowBurst =
          f.depth === 1
            ? "drop-shadow-[0_0_22px_rgba(255,214,107,1)]"
            : f.depth === 2
              ? "drop-shadow-[0_0_30px_rgba(255,214,107,1)]"
              : "drop-shadow-[0_0_42px_rgba(255,214,107,1)]"

        // Nền hạt: sáng trung tâm, loang ra (giữ vibe cũ)
        const bg = isBurst
          ? "radial-gradient(circle, rgba(255,214,107,1) 0%, rgba(255,214,107,0.55) 32%, rgba(255,214,107,0) 72%)"
          : "radial-gradient(circle, rgba(255,214,107,0.98) 0%, rgba(255,214,107,0.42) 34%, rgba(255,214,107,0) 72%)"

        return (
          <motion.span
            key={f.id}
            className={`absolute rounded-full ${isBurst ? glowBurst : glowA}`}
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              filter: `blur(${f.blur}px)`,
              background: bg,
              // gần nổi hơn
              mixBlendMode: "screen",
            }}
            initial={{ opacity: 0 }}
            animate={{
              // drift loop
              x: [0, f.driftX, 0, -f.driftX * 0.65, 0],
              y: [0, f.driftY, 0, -f.driftY * 0.65, 0],

              // “thở” (giữ nét như fire cũ)
              opacity: isBurst
                ? [f.baseOpacity, 1, f.baseOpacity]
                : [f.baseOpacity * 0.78, f.baseOpacity * 1.18, f.baseOpacity * 0.82],

              // scale nhẹ; burst scale mạnh
              scale: isBurst ? [1, 1.45, 1] : [1, 1.12, 1],
            }}
            transition={{
              // drift
              x: { duration: f.driftDuration, repeat: Infinity, ease: "easeInOut", delay: f.delay },
              y: { duration: f.driftDuration, repeat: Infinity, ease: "easeInOut", delay: f.delay },

              // pulse opacity/scale
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