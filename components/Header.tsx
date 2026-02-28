"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type NavItem = {
  name: string
  href: string
  key: "home" | "products" | "warranty" | "contact"
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", name: "Trang chủ", href: "/" },
  { key: "products", name: "Sản phẩm", href: "/san-pham-full#products" },
  { key: "warranty", name: "Bảo Hành", href: "/bao-hanh" },
  { key: "contact", name: "Liên Hệ", href: "/lien-he" },
]

// ✅ Exact scroll to each category block
const PRODUCT_CATS = [
  { key: "edison", name: "Bộ dây đèn EDISON", href: "/san-pham-full?cat=edison#cat-edison" },
  { key: "tron", name: "Bộ dây đèn Tròn", href: "/san-pham-full?cat=tron#cat-tron" },
  { key: "day-le-bong-le", name: "Dây lẻ, Bóng lẻ", href: "/san-pham-full?cat=day-le-bong-le#cat-day-le-bong-le" },
]

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  const pure = href.split("?")[0].split("#")[0]
  return pathname.startsWith(pure)
}

function isSanPhamFullHref(href: string) {
  return href.startsWith("/san-pham-full")
}

// --- SF-symbol-ish icon base style (thin + rounded) ---
function SvgWrap({
  children,
  active,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center",
        active
          ? "text-[#FFD66B] drop-shadow-[0_0_10px_rgba(255,214,107,0.35)]"
          : "text-white/78",
      ].join(" ")}
    >
      {children}
    </span>
  )
}

const STROKE = 1.55

function IconHome({ active }: { active?: boolean }) {
  return (
    <SvgWrap active={active}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4.8 10.7 12 5l7.2 5.7V19a2.3 2.3 0 0 1-2.3 2.3h-3.9v-6.1a1.2 1.2 0 0 0-1.2-1.2h-0.8a1.2 1.2 0 0 0-1.2 1.2v6.1H7.1A2.3 2.3 0 0 1 4.8 19v-8.3Z"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgWrap>
  )
}

function IconSquares({ active }: { active?: boolean }) {
  return (
    <SvgWrap active={active}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.7 6.7h4.8v4.8H6.7V6.7Zm5.8 0h4.8v4.8h-4.8V6.7ZM6.7 12.5h4.8v4.8H6.7v-4.8Zm5.8 0h4.8v4.8h-4.8v-4.8Z"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
      </svg>
    </SvgWrap>
  )
}

function IconShieldCheck({ active }: { active?: boolean }) {
  return (
    <SvgWrap active={active}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4.7 19 8v5.1c0 4.6-3 8.2-7 9.2-4-1-7-4.6-7-9.2V8l7-3.3Z"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <path
          d="m9.2 12.2 1.8 1.8 3.9-4.5"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SvgWrap>
  )
}

function IconPhone({ active }: { active?: boolean }) {
  return (
    <SvgWrap active={active}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M8.3 4.8h7.4A2.3 2.3 0 0 1 18 7.1v9.8a2.3 2.3 0 0 1-2.3 2.3H8.3A2.3 2.3 0 0 1 6 16.9V7.1a2.3 2.3 0 0 1 2.3-2.3Z"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
        <path
          d="M10.6 17.6h2.8"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
        />
      </svg>
    </SvgWrap>
  )
}

function IconDots9({ active }: { active?: boolean }) {
  const fill = active ? "#FFD66B" : "rgba(255,255,255,0.88)"
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {[
        [6, 6],[12, 6],[18, 6],
        [6, 12],[12, 12],[18, 12],
        [6, 18],[12, 18],[18, 18],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.35" fill={fill} />
      ))}
    </svg>
  )
}

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearchParams()
  const activeCat = search.get("cat") || ""

  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const activeItem = useMemo(() => {
    return NAV_ITEMS.find((i) => isActivePath(pathname, i.href)) ?? NAV_ITEMS[0]
  }, [pathname])

  useEffect(() => setOpen(false), [pathname, activeCat])

  // ✅ Warm-up route: mở menu là prefetch luôn /san-pham-full để click "Sản phẩm" gần như instant
  useEffect(() => {
    if (!open) return
    router.prefetch("/san-pham-full")
  }, [open, router])

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
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const headerBg = scrolled ? "bg-black/55" : "bg-black/30"
  const headerBlur = scrolled ? "backdrop-blur-2xl" : "backdrop-blur-xl"
  const headerShadow = scrolled
    ? "shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
    : "shadow-[0_20px_70px_rgba(0,0,0,0.7)]"

  return (
    <>
      {/* Hero background behind header */}
      <div
        aria-hidden
        className="fixed top-0 left-0 w-full h-28 md:h-32 z-40 pointer-events-none"
        style={{
          backgroundImage: "var(--hero-bg, url('/images/hero-outdoor.webp'))",
          backgroundSize: "cover",
          backgroundPosition: "top",
          filter: "blur(5px)",
          opacity: scrolled ? 0.25 : 0.55,
          transform: "scale(1.02)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ✅ Safe-area top */}
      <header
        className="fixed left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 24px)" }}
      >
        <div className="relative rounded-full">
          <div
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              padding: "1px",
              background:
                "linear-gradient(90deg, rgba(255,214,107,0.85) 0%, rgba(255,214,107,0.15) 40%, rgba(255,214,107,0.15) 60%, rgba(255,214,107,0.85) 100%)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <nav
            className={[
              "relative flex items-center justify-between px-6 md:px-12 rounded-full",
              headerBg,
              headerBlur,
              headerShadow,
              "border border-white/10",
              "py-3 md:py-3.5",
            ].join(" ")}
          >
            <Link href="/" prefetch={false} className="flex items-center gap-4 whitespace-nowrap">
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo.webp"
                  alt="Logo"
                  width={48}
                  height={48}
                  quality={85}
                  className="rounded-full object-cover ring-[0.5px] ring-white/18 shadow-[0_0_24px_rgba(255,214,107,0.45)]"
                  priority
                />
              </div>

              <span className="relative text-white font-semibold text-xl sm:text-2xl md:text-3xl tracking-wide">
                <span aria-hidden className="pointer-events-none absolute inset-0 text-[#FFD66B] opacity-35 blur-md">
                  ĐÓM XÊNH
                </span>
                <span className="relative drop-shadow-[0_0_14px_rgba(255,214,107,0.85)]">
                  ĐÓM XÊNH
                </span>
              </span>
            </Link>

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => {
                const active = isActivePath(pathname, item.href)
                const prefetch = isSanPhamFullHref(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={prefetch}
                    onMouseEnter={() => {
                      if (prefetch) router.prefetch("/san-pham-full")
                    }}
                    className="relative px-2 whitespace-nowrap"
                  >
                    <span
                      className={[
                        "font-medium whitespace-nowrap",
                        active
                          ? "text-[#FFD66B] drop-shadow-[0_0_14px_rgba(255,214,107,0.70)]"
                          : "text-white/80 hover:text-white",
                      ].join(" ")}
                    >
                      {item.name}
                    </span>
                    {active && (
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-3 right-3 h-[2px] rounded-full bg-[#FFD66B]/80 shadow-[0_0_18px_rgba(255,214,107,0.65)]"
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <span className="text-sm font-semibold px-3 py-1.5 rounded-full border bg-white/5 border-white/12 text-white/90 shadow-[0_0_24px_rgba(255,214,107,0.12)]">
                <span className="text-[#FFD66B] drop-shadow-[0_0_10px_rgba(255,214,107,0.45)]">
                  {activeItem.name}
                </span>
              </span>

              <button
                type="button"
                aria-label="Menu"
                onClick={() => setOpen((v) => !v)}
                className="text-white/95 hover:text-white transition rounded-full px-3 py-2 border border-white/10 bg-white/5 outline-none"
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                <IconDots9 active={open} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/55"
            onClick={() => setOpen(false)}
            style={{ WebkitTapHighlightColor: "transparent" }}
          />

          <div
            className="absolute left-1/2 -translate-x-1/2 w-[94%] max-w-6xl"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 24px)" }}
          >
            <div className="rounded-3xl border border-white/12 bg-black/70 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/logo.webp"
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full object-cover ring-[0.5px] ring-white/18"
                  />
                  <div className="text-white font-semibold text-xl">ĐÓM XÊNH</div>
                </div>

                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="text-white/85 hover:text-white transition rounded-full px-3 py-2 border border-white/10 bg-white/5 outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  <span className="text-xl leading-none">×</span>
                </button>
              </div>

              <div className="p-3">
                {NAV_ITEMS.map((item) => {
                  const active = isActivePath(pathname, item.href)
                  const prefetch = isSanPhamFullHref(item.href)

                  const icon =
                    item.key === "home" ? <IconHome active={active} /> :
                    item.key === "products" ? <IconSquares active={active} /> :
                    item.key === "warranty" ? <IconShieldCheck active={active} /> :
                    <IconPhone active={active} />

                  return (
                    <div key={item.href} className="mb-1">
                      <Link
                        href={item.href}
                        prefetch={prefetch}
                        onMouseEnter={() => {
                          if (prefetch) router.prefetch("/san-pham-full")
                        }}
                        onClick={() => setOpen(false)}
                        className={[
                          "flex items-center gap-3 rounded-2xl px-4 py-3 transition",
                          "border border-transparent outline-none",
                          active
                            ? "bg-white/10 border-white/15 text-white shadow-[0_0_28px_rgba(255,214,107,0.10)]"
                            : "text-white/90 hover:bg-white/8",
                        ].join(" ")}
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        {icon}
                        <span
                          className={[
                            "font-medium",
                            active
                              ? "text-[#FFD66B] drop-shadow-[0_0_14px_rgba(255,214,107,0.55)]"
                              : "",
                          ].join(" ")}
                        >
                          {item.name}
                        </span>
                      </Link>

                      {item.key === "products" && (
                        <div className="mt-2 ml-11 space-y-1">
                          {PRODUCT_CATS.map((c) => {
                            const subActive =
                              pathname.startsWith("/san-pham-full") && activeCat === c.key

                            return (
                              <Link
                                key={c.href}
                                href={c.href}
                                prefetch={true}
                                onMouseEnter={() => router.prefetch("/san-pham-full")}
                                onClick={() => setOpen(false)}
                                className={[
                                  "block rounded-xl px-4 py-2 border border-transparent outline-none",
                                  subActive
                                    ? "bg-white/10 border-white/15 text-[#FFD66B] drop-shadow-[0_0_14px_rgba(255,214,107,0.55)]"
                                    : "text-white/80 hover:text-white hover:bg-white/8",
                                ].join(" ")}
                                style={{ WebkitTapHighlightColor: "transparent" }}
                              >
                                <span className="text-sm">• {c.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// end code