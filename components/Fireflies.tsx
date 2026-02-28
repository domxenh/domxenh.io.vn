"use client"

/**
 * Fireflies (Global - upgraded feel, still lightweight)
 * - CSS-only animations (no framer-motion)
 * - 1 global overlay fixed
 * - Richer glow (core + halo), nicer twinkle
 * - Mobile reduced density, respects prefers-reduced-motion
 *
 * FIX (Hydration):
 * - Next.js vẫn pre-render Client Components trên server.
 * - Math.random() ở render đầu gây mismatch -> hydration error.
 * - Giải pháp nhẹ: chỉ enable + build random sau khi client mount.
 */

import React, { useEffect, useMemo, useState } from "react"

type Firefly = {
  id: number
  x: number // %
  y: number // %
  size: number // px
  blur: number // px
  opacity: number
  driftX: number // px
  driftY: number // px
  driftDur: number // s
  twinkleDur: number // s
  delay: number // s
  hue: number // deg (warm variations)
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min

function build(count: number, tinyCount: number) {
  const main: Firefly[] = []
  const tiny: Firefly[] = []

  for (let i = 0; i < count; i++) {
    const size = rand(2.6, 6.2)
    main.push({
      id: 1000 + i,
      x: rand(0, 100),
      y: rand(0, 100),
      size,
      blur: rand(0.25, 1.6),
      opacity: rand(0.24, 0.62),
      driftX: rand(-110, 110),
      driftY: rand(-95, 95),
      driftDur: rand(11, 19),
      twinkleDur: rand(2.8, 5.8),
      delay: rand(0, 4.5),
      hue: rand(40, 55), // ấm vàng-cam nhẹ
    })
  }

  for (let i = 0; i < tinyCount; i++) {
    const size = rand(1.2, 2.2)
    tiny.push({
      id: 5000 + i,
      x: rand(0, 100),
      y: rand(0, 100),
      size,
      blur: rand(0.15, 0.9),
      opacity: rand(0.08, 0.22),
      driftX: rand(-70, 70),
      driftY: rand(-55, 55),
      driftDur: rand(14, 24),
      twinkleDur: rand(3.6, 7.2),
      delay: rand(0, 6),
      hue: rand(38, 58),
    })
  }

  return { main, tiny }
}

export default function Fireflies() {
  // ✅ Hydration-safe: chỉ render sau khi client mount
  const [mounted, setMounted] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [count, setCount] = useState(0)
  const [tinyCount, setTinyCount] = useState(0)

  useEffect(() => {
    setMounted(true)

    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const mqMobile = window.matchMedia("(max-width: 768px)")

    const apply = () => {
      const reduce = mqReduce.matches
      const mobile = mqMobile.matches

      setEnabled(!reduce)

      // mobile: giảm mạnh để nhẹ
      setCount(mobile ? 12 : 26)
      setTinyCount(mobile ? 8 : 18)
    }

    apply()
    mqReduce.addEventListener?.("change", apply)
    mqMobile.addEventListener?.("change", apply)
    return () => {
      mqReduce.removeEventListener?.("change", apply)
      mqMobile.removeEventListener?.("change", apply)
    }
  }, [])

  const { main, tiny } = useMemo(() => {
    if (!mounted || !enabled || count <= 0) return { main: [], tiny: [] }
    return build(count, tinyCount)
  }, [mounted, enabled, count, tinyCount])

  if (!mounted || !enabled) return null

  return (
    <>
      <div className="fireflies-global" aria-hidden>
        {/* MAIN FIREFLIES */}
        {main.map((f) => (
          <span
            key={f.id}
            className="firefly firefly--main"
            style={
              {
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                filter: `blur(${f.blur}px)`,
                opacity: f.opacity,
                ["--dx" as any]: `${f.driftX}px`,
                ["--dy" as any]: `${f.driftY}px`,
                ["--dd" as any]: `${f.driftDur}s`,
                ["--td" as any]: `${f.twinkleDur}s`,
                ["--dl" as any]: `${f.delay}s`,
                ["--h" as any]: `${f.hue}deg`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* TINY SPARKS */}
        {tiny.map((f) => (
          <span
            key={f.id}
            className="firefly firefly--tiny"
            style={
              {
                left: `${f.x}%`,
                top: `${f.y}%`,
                width: `${f.size}px`,
                height: `${f.size}px`,
                filter: `blur(${f.blur}px)`,
                opacity: f.opacity,
                ["--dx" as any]: `${f.driftX}px`,
                ["--dy" as any]: `${f.driftY}px`,
                ["--dd" as any]: `${f.driftDur}s`,
                ["--td" as any]: `${f.twinkleDur}s`,
                ["--dl" as any]: `${f.delay}s`,
                ["--h" as any]: `${f.hue}deg`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <style jsx global>{`
        .fireflies-global {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 5;
          mix-blend-mode: screen;
          opacity: 0.95;
        }

        /* Base */
        .firefly {
          position: absolute;
          border-radius: 9999px;
          transform: translate3d(0, 0, 0);
          will-change: transform, opacity, filter;
          animation:
            ff-drift var(--dd) cubic-bezier(0.45, 0.05, 0.2, 0.95) var(--dl) infinite,
            ff-twinkle var(--td) ease-in-out calc(var(--dl) * 0.6) infinite;
        }

        /* MAIN glow: core + halo (đã hơn) */
        .firefly--main {
          background: radial-gradient(
            circle,
            hsla(var(--h), 100%, 70%, 1) 0%,
            hsla(var(--h), 100%, 60%, 0.55) 28%,
            hsla(var(--h), 100%, 60%, 0.18) 52%,
            hsla(var(--h), 100%, 60%, 0) 76%
          );
          box-shadow:
            0 0 10px hsla(var(--h), 100%, 70%, 0.45),
            0 0 22px hsla(var(--h), 100%, 70%, 0.25),
            0 0 44px hsla(var(--h), 100%, 70%, 0.12);
        }

        /* Tiny sparks: nhẹ, mờ, tạo chiều sâu */
        .firefly--tiny {
          background: radial-gradient(
            circle,
            hsla(var(--h), 100%, 74%, 0.85) 0%,
            hsla(var(--h), 100%, 65%, 0.28) 36%,
            hsla(var(--h), 100%, 60%, 0) 76%
          );
          box-shadow: 0 0 8px hsla(var(--h), 100%, 70%, 0.18);
        }

        @keyframes ff-drift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          45% {
            transform: translate3d(var(--dx), var(--dy), 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        /* Twinkle natural: không lên xuống đều */
        @keyframes ff-twinkle {
          0% {
            opacity: 0.55;
            filter: brightness(1);
          }
          22% {
            opacity: 0.95;
            filter: brightness(1.2);
          }
          48% {
            opacity: 0.62;
            filter: brightness(1.05);
          }
          72% {
            opacity: 1;
            filter: brightness(1.28);
          }
          100% {
            opacity: 0.6;
            filter: brightness(1);
          }
        }
      `}</style>
    </>
  )
}

// end code