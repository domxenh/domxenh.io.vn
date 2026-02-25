/**
 * Tóm tắt (VI):
 * - Canvas animation "đom đóm" (fireflies) nhẹ, mượt: hạt bay chậm + nhấp nháy
 * - Dùng requestAnimationFrame; tự resize theo hero container
 * - Tối ưu: giảm motion khi user bật "prefers-reduced-motion"; pause khi tab ẩn
 *
 * Chỗ cần chỉnh:
 * - COUNT: số lượng đom đóm
 * - SPEED: tốc độ bay
 * - SIZE_RANGE / GLOW_RANGE: kích thước và độ glow
 * - HUE: tông màu (vàng ấm)
 */

"use client"

import { useEffect, useMemo, useRef } from "react"

type Firefly = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  phase: number
  twinkle: number
}

export default function Fireflies() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)
  const fliesRef = useRef<Firefly[]>([])
  const reducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  }, [])

  // ====== TUNING ZONE (CHỈNH Ở ĐÂY) ======
  const COUNT = 26
  const SPEED = 0.18
  const SIZE_RANGE: [number, number] = [0.9, 2.2]
  const GLOW_RANGE: [number, number] = [6, 18]
  const HUE = 46 // vàng ấm
  // ======================================

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return

    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      const { width, height } = parent.getBoundingClientRect()
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      const { width, height } = parent.getBoundingClientRect()
      fliesRef.current = Array.from({ length: COUNT }, () => {
        const angle = rand(0, Math.PI * 2)
        return {
          x: rand(0, width),
          y: rand(0, height),
          vx: Math.cos(angle) * rand(0.2, 1) * SPEED,
          vy: Math.sin(angle) * rand(0.2, 1) * SPEED,
          r: rand(SIZE_RANGE[0], SIZE_RANGE[1]),
          phase: rand(0, Math.PI * 2),
          twinkle: rand(0.6, 1.2),
        }
      })
    }

    const step = (t: number) => {
      if (reducedMotion) return

      const { width, height } = parent.getBoundingClientRect()
      const dt = Math.min(32, t - (lastRef.current || t))
      lastRef.current = t

      ctx.clearRect(0, 0, width, height)

      // Vẽ từng con
      for (const f of fliesRef.current) {
        // Move
        f.x += f.vx * dt
        f.y += f.vy * dt

        // Drift nhẹ (cho tự nhiên)
        f.vx += rand(-0.002, 0.002) * dt
        f.vy += rand(-0.002, 0.002) * dt

        // Clamp vận tốc
        const maxV = 0.22
        f.vx = Math.max(-maxV, Math.min(maxV, f.vx))
        f.vy = Math.max(-maxV, Math.min(maxV, f.vy))

        // Wrap edges
        if (f.x < -20) f.x = width + 20
        if (f.x > width + 20) f.x = -20
        if (f.y < -20) f.y = height + 20
        if (f.y > height + 20) f.y = -20

        // Twinkle (nhấp nháy)
        f.phase += 0.02 * f.twinkle
        const pulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f.phase)) // 0..1
        const alpha = 0.10 + 0.55 * pulse

        const glow = rand(GLOW_RANGE[0], GLOW_RANGE[1])
        ctx.save()
        ctx.globalCompositeOperation = "lighter"

        // Glow
        ctx.beginPath()
        ctx.fillStyle = `hsla(${HUE}, 100%, 65%, ${alpha * 0.55})`
        ctx.shadowBlur = glow
        ctx.shadowColor = `hsla(${HUE}, 100%, 70%, ${alpha})`
        ctx.arc(f.x, f.y, f.r * (1 + pulse * 0.35), 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.shadowBlur = 0
        ctx.fillStyle = `hsla(${HUE}, 100%, 78%, ${alpha})`
        ctx.arc(f.x, f.y, Math.max(0.6, f.r * 0.55), 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(step)
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      } else if (!reducedMotion) {
        lastRef.current = performance.now()
        rafRef.current = requestAnimationFrame(step)
      }
    }

    resize()
    init()

    const ro = new ResizeObserver(() => {
      resize()
      // giữ lại vị trí tương đối cho mượt: init lại nhẹ nếu resize quá khác
      init()
    })
    ro.observe(parent)

    document.addEventListener("visibilitychange", onVisibility)

    if (!reducedMotion) {
      lastRef.current = performance.now()
      rafRef.current = requestAnimationFrame(step)
    }

    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      ro.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-90"
      aria-hidden="true"
    />
  )
}

/** end code */