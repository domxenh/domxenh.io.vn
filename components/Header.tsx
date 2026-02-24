"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  AnimatePresence
} from "framer-motion"

export default function Header() {
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [open, setOpen] = useState(false)

  /* =============================
     SCROLL SHRINK SYSTEM
  ============================== */

  const blurValue = useTransform(scrollY, [0, 300], [18, 30])
  const bgOpacity = useTransform(scrollY, [0, 300], [0.18, 0.35])
  const paddingY = useTransform(scrollY, [0, 300], [14, 8])
  const logoScale = useTransform(scrollY, [0, 300], [1.1, 0.85])
  const fontScale = useTransform(scrollY, [0, 300], [1, 0.9])

  const backdropFilter = useMotionTemplate`blur(${blurValue}px)`
  const backgroundColor = useMotionTemplate`rgba(20,25,30,${bgOpacity})`
  const navPadding = useMotionTemplate`${paddingY}px`

  const menuItems = [
    { name: "Trang chủ", href: "/" },
    { name: "Edison", href: "/edison" },
    { name: "Đèn Tròn", href: "/den-tron" },
    { name: "Dây & Bóng", href: "/day-bong" },
  ]

  const activeItem =
    menuItems.find((item) => item.href === pathname) || menuItems[0]

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl">

        <div className="relative rounded-full">

          {/* BORDER BASE */}
          <div
            className="absolute inset-0 rounded-full"
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
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              padding: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
              backgroundSize: "200% 100%",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
            animate={{ backgroundPosition: ["-200% 0%", "200% 0%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          <motion.nav
            style={{
              backdropFilter,
              backgroundColor,
              paddingTop: navPadding,
              paddingBottom: navPadding
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
                    border border-white/25
                    shadow-[0_0_35px_rgba(255,214,107,0.75)]
                  "
                  priority
                />
              </motion.div>

              <motion.span
                style={{ scale: fontScale }}
                className="
                  text-white
                  font-semibold
                  text-3xl
                  tracking-wide
                  drop-shadow-[0_0_12px_rgba(255,214,107,0.8)]
                "
              >
                ĐÓM XÊNH
              </motion.span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-10 text-xl font-medium">

              {menuItems.map((item) => {
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
                        layoutId="underline"
                        className="
                          absolute left-0 right-0
                          -bottom-3
                          h-[4px]
                          rounded-full
                          bg-gradient-to-r
                          from-transparent
                          via-[#FFD66B]
                          to-transparent
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
                onClick={() => setOpen(!open)}
                className="relative flex items-center gap-3 text-lg font-medium text-white"
              >
                <span className="drop-shadow-[0_0_10px_rgba(255,214,107,0.9)]">
                  {activeItem.name}
                </span>

                {/* Apple grid icon */}
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

                <motion.div
                  layoutId="underline"
                  className="
                    absolute left-0 right-0
                    -bottom-3
                    h-[4px]
                    rounded-full
                    bg-gradient-to-r
                    from-transparent
                    via-[#FFD66B]
                    to-transparent
                  "
                />
              </button>
            </div>

          </motion.nav>
        </div>
      </header>

      {/* ===== APPLE PANEL WITH CLOSE + OUTSIDE CLICK ===== */}
      <AnimatePresence>
        {open && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-xl"
            />

            {/* PANEL */}
            <motion.div
              initial={{ y: -250 }}
              animate={{ y: 0 }}
              exit={{ y: -250 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="
                fixed top-0 left-0
                w-full
                z-[999]
                pt-28
                px-5
              "
            >
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

                {/* CLOSE BUTTON */}
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

                <div className="text-white/80 text-xl font-semibold">
                  Ứng dụng
                </div>

                <div className="grid grid-cols-2 gap-8">

                  {[
                    { name: "Trang chủ", href: "/", icon: "/icons/home.png" },
                    { name: "Edison", href: "/edison", icon: "/icons/edison.png" },
                    { name: "Đèn Tròn", href: "/den-tron", icon: "/icons/den-tron.png" },
                    { name: "Dây & Bóng", href: "/day-bong", icon: "/icons/day-bong.png" },
                  ].map((item) => {
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center space-y-3 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className={`
                            w-20 h-20
                            flex items-center justify-center
                            rounded-3xl
                            bg-white/15
                            border border-white/20
                            ${
                              isActive
                                ? "shadow-[0_0_35px_rgba(255,214,107,1)]"
                                : "group-hover:bg-white/25"
                            }
                          `}
                        >
                          <Image
                            src={item.icon}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-contain"
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