"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

export default function FadeInSection({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "80px 0px" }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [shown])

  return (
    <div ref={ref} className={shown ? "dx-fadein is-in" : "dx-fadein"}>
      {children}
    </div>
  )
}