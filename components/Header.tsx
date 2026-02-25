"use client"

/**
 * components/Header.tsx
 *
 * TÓM TẮT (Header Ver5 – tối ưu mượt dựa trên cấu trúc Ver4):
 * - Giữ kiến trúc cũ: Border base + Shimmer + Scroll shrink + Underline + Mobile Apple panel.
 * - [V5] Scroll shrink mượt hơn: dùng useSpring để lọc scrollY trước khi transform blur/bg/padding/scale.
 * - [V5] Underline mượt, tránh giật responsive: tách layoutId desktop, mobile không dùng layoutId.
 * - [V5] Popup đóng nhanh hơn: exit dùng tween duration ngắn + giảm quãng trượt.
 * - [V5] Click vào khoảng trống (vùng wrapper panel) sẽ tắt popup.
 * - [V5] Khoá scroll nền khi mở popup + ESC để đóng + tự đóng khi đổi route.
 * - [V5] Update menu:
 *   Trang chủ / Sản phẩm / Bảo Hành / Liên Hệ (+ đổi href tương ứng).
 */

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"

/**
 * [V5] Menu mới theo yêu cầu:
 * - Edison  -> Sản phẩm
 * - Đèn Tròn -> Bảo Hành
 * - Dây & Bóng -> Liên Hệ
 *
 * NOTE: Icon giữ nguyên file hiện có để không vỡ asset.
 * Nếu bạn muốn icon đúng nghĩa, đổi lại các path /icons/*.png.
 */
const NAV_ITEMS = [
  { name: "Trang chủ", href: "/", icon: "/icons/home.png" },
  { name: "Sản phẩm", href: "/san-pham-full", icon: "/icons/san-pham-full.png" },
  { name: "Bảo Hành", href: "/bao-hanh", icon: "/icons/bao-hanh.png" },
  { name: "Liên Hệ", href: "/lien-he", icon: "/icons/lien-he.png" },
]

export default function Header() {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const [open, setOpen] = useState(false)

  /** [V5] Active item (ưu tiên match chính xác, fallback Trang chủ) */
  const activeItem = useMemo(() => {
    return NAV_ITEMS.find((item) => item.href === pathname) || NAV_ITEMS[0]
  }, [pathname])

  /**
   * =============================
   * [V5] SCROLL SHRINK SYSTEM (SMOOTH)
   * =============================
   */
  const scrollYSmooth = useSpring(scrollY, {
    stiffness: 180,
    damping: 32,
    mass: 0.7,
  })

  const blurValue = useTransform(scrollYSmooth, [0, 300], [18, 30])
  const bgOpacity = useTransform(scrollYSmooth, [0, 300], [0.18, 0.35])
  const paddingY = useTransform(scrollYSmooth, [0, 300], [14, 8])
  const logoScale = useTransform(scrollYSmooth, [0, 300], [1.1, 0.85])
  const fontScale = useTransform(scrollYSmooth, [0, 300], [1, 0.9])

  const backdropFilter = useMotionTemplate`blur(${blurValue}px)`
  const backgroundColor = useMotionTemplate`rgba(20,25,30,${bgOpacity})`
  const navPadding = useMotionTemplate`${paddingY}px`

  /**
   * =============================
   * [V5] MOBILE PANEL UX POLISH
   * =============================
   */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl">
        <div className="relative rounded-full">
          {/* BORDER BASE */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              padding: "1px",
              background: `
                linear-gradient(
                  90deg,
                  rgba(255,214,107,0.9) 0%,
                  rgba(255,214,107,0.15) 40%,
                  rgba(255,214,107,0.15) 60%,
                  rgba(255,214,107,0.9) 100%
                )
              `,
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {/* SHIMMER */}
          {!reduceMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                padding: "1px",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                backgroundSize: "200% 100%",
                WebkitMask:
                  "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                willChange: "background-position",
              }}
              animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
          )}

          <motion.nav
            style={{
              backdropFilter,
              backgroundColor,
              paddingTop: navPadding,
              paddingBottom: navPadding,
              willChange: "backdrop-filter, background-color, padding",
            }}
            className="
              relative
              flex items-center justify-between
              px-6 md:px-12
              rounded-full
              shadow-[0_30px_90px_rgba(0,0,0,0.8)]
            "
          >
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-4 whitespace-nowrap">
              <motion.div
                style={{ scale: logoScale }}
                className="w-12 h-12 flex items-center justify-center shrink-0"
              >
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="
                    rounded-full
                    object-cover
                    ring-1 ring-white/25
                    shadow-[0_0_35px_rgba(255,214,107,0.75)]
                    scale-[1.06]
                  "
                  priority
                />
              </motion.div>

              {/* Glow chữ */}
              <motion.span
                style={{ scale: fontScale }}
                className="relative text-white font-semibold text-3xl tracking-wide"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 text-[#FFD66B] opacity-35 blur-md"
                >
                  ĐÓM XÊNH
                </span>
                <span className="relative drop-shadow-[0_0_14px_rgba(255,214,107,0.85)]">
                  ĐÓM XÊNH
                </span>
              </motion.span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-10 text-[20px] font-semibold">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-2 whitespace-nowrap"
                  >
                    <span
                      className={`
                        transition duration-300
                        ${
                          isActive
                            ? "text-white drop-shadow-[0_0_10px_rgba(255,214,107,0.9)]"
                            : "text-white/80 hover:text-[#FFD66B] hover:drop-shadow-[0_0_14px_rgba(255,214,107,1)]"
                        }
                      `}
                    >
                      {item.name}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="desktop-underline"
                        transition={{ type: "spring", stiffness: 520, damping: 40 }}
                        className="
                          absolute left-0 right-0
                          -bottom-3
                          h-[4px]
                          rounded-full
                          bg-gradient-to-r
                          from-transparent
                          via-[#FFD66B]
                          to-transparent
                          shadow-[0_0_18px_rgba(255,214,107,0.85)]
                        "
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* MOBILE BUTTON */}
            <div className="md:hidden relative">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="dialog"
                className="relative flex items-center gap-3 text-lg font-semibold text-white"
              >
                <span className="drop-shadow-[0_0_10px_rgba(255,214,107,0.9)]">
                  {activeItem.name}
                </span>

                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="5" r="2" />
                  <circle cx="12" cy="5" r="2" />
                  <circle cx="19" cy="5" r="2" />
                  <circle cx="5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19" cy="12" r="2" />
                  <circle cx="5" cy="19" r="2" />
                  <circle cx="12" cy="19" r="2" />
                  <circle cx="19" cy="19" r="2" />
                </svg>

                <div
                  aria-hidden
                  className="
                    absolute left-0 right-0
                    -bottom-3
                    h-[4px]
                    rounded-full
                    bg-gradient-to-r
                    from-transparent
                    via-[#FFD66B]
                    to-transparent
                    shadow-[0_0_18px_rgba(255,214,107,0.85)]
                  "
                />
              </button>
            </div>
          </motion.nav>
        </div>
      </header>

      {/* ===== APPLE PANEL ===== */}
      <AnimatePresence initial={false}>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.12 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-xl"
            />

            {/* PANEL WRAPPER (click khoảng trống => tắt) */}
            <motion.div
              initial={{ y: -180, opacity: 0.98 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{
                y: -180,
                opacity: 0,
                transition: { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] },
              }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              onClick={() => setOpen(false)}
              className="fixed top-0 left-0 w-full z-[999] pt-28 px-5"
              role="dialog"
              aria-modal="true"
            >
              {/* CARD */}
              <div
                className="
                  relative
                  mx-auto
                  w-full max-w-md
                  bg-white/10
                  backdrop-blur-2xl
                  rounded-3xl
                  border border-white/20
                  shadow-[0_40px_100px_rgba(0,0,0,0.8)]
                  p-6
                  space-y-6
                "
                onClick={(e) => e.stopPropagation()}
              >
                {/* CLOSE */}
                <button
                  onClick={() => setOpen(false)}
                  className="
                    absolute top-4 right-4
                    w-10 h-10
                    rounded-full
                    bg-white/10
                    backdrop-blur-md
                    border border-white/20
                    flex items-center justify-center
                    text-white/80
                    transition
                    hover:bg-white/20
                    hover:scale-110
                  "
                  aria-label="Đóng"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <div className="text-white/80 text-xl font-semibold">Ứng dụng</div>

                <div className="grid grid-cols-2 gap-8">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center space-y-3 group"
                      >
                        {/* ICON TILE */}
                        <motion.div
                          whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`
                            relative w-20 h-20
                            rounded-3xl
                            overflow-hidden
                            bg-white/15
                            border border-white/20
                            ${
                              isActive
                                ? "shadow-[0_0_35px_rgba(255,214,107,1)]"
                                : "group-hover:bg-white/25"
                            }
                          `}
                        >
                          {/* NOTE:
                             - fill + object-cover để phủ kín tile
                             - scale để “ăn” padding nằm bên trong file icon (nếu icon có khoảng trắng)
                           */}
                          <Image
                            src={item.icon}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover object-center rounded-[inherit] scale-[1.22]"
                          />
                        </motion.div>

                        <span
                          className={`
                            text-base font-medium transition
                            ${
                              isActive
                                ? "text-white drop-shadow-[0_0_12px_rgba(255,214,107,1)]"
                                : "text-white/80 group-hover:text-white"
                            }
                          `}
                        >
                          {item.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// end code