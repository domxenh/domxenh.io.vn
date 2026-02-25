/**
 * Tóm tắt (VI):
 * - Hero tĩnh (không scroll animation)
 * - Đồng bộ ảnh nền với Header: dùng /images/hero-outdoor.png
 * - Set CSS var --hero-bg để header có thể dùng cùng ảnh hero (tạo cảm giác liền mạch)
 * - Mobile tối ưu: chiều cao hero thấp hơn, thêm padding-top để không bị header che,
 *   font/button scale hợp lý, object-position đẹp hơn.
 * - Nút "Khám phá ngay" scroll mượt xuống section sản phẩm id="products"
 *
 * Chỗ cần chỉnh:
 * - TARGET_ID: id section sản phẩm
 * - HERO_BG: ảnh nền hero (đang dùng hero-outdoor.png)
 * - HERO_HEIGHT: chiều cao responsive
 */

"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect } from "react"
import Fireflies from "@/components/Fireflies"

function GlowWord({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-flex items-center font-extrabold italic">
      {/* nền highlight */}
      <span
        aria-hidden
        className="absolute -inset-x-2 -inset-y-1 rounded-full bg-[#FFD66B]/18"
      />

      {/* glow mạnh */}
      <span
        aria-hidden
        className="absolute inset-0 text-[#FFD66B] opacity-80 blur-md"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 text-[#FFD66B] opacity-45 blur-2xl"
      >
        {children}
      </span>

      {/* chữ thật (không được transparent nữa) */}
      <span className="relative text-[#FFD66B] drop-shadow-[0_0_20px_rgba(255,214,107,1)]">
        {children}
      </span>
    </span>
  )
}

export default function Hero() {
  const TARGET_ID = "products"

  // ✅ Đồng bộ ảnh hero với header
  const HERO_BG = "/images/hero-outdoor.png"

  // ✅ Mobile thấp hơn, desktop cao hơn
  const HERO_HEIGHT = "h-[72vh] sm:h-[80vh] md:h-[92vh]"

  // ✅ Set CSS var để Header có thể lấy đúng ảnh Hero (liền mạch)
  useEffect(() => {
    document.documentElement.style.setProperty("--hero-bg", `url('${HERO_BG}')`)
    return () => {
      document.documentElement.style.removeProperty("--hero-bg")
    }
  }, [HERO_BG])

  const handleScrollToProducts = () => {
    const el = document.getElementById(TARGET_ID)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <motion.section
      className={`relative w-full overflow-hidden ${HERO_HEIGHT}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt="Đèn trang trí ĐÓM XÊNH"
          className="
            w-full h-full object-cover
            object-[center_35%]
            md:object-center
            scale-[1.03]
          "
        />
      </div>

      {/* Overlay (giữ ảnh nhìn thấy, chỉ tối + blur nhẹ) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-[#0B1417]" />

      {/* Fireflies layer */}
      <div className="absolute inset-0">
        <Fireflies variant="hero" />
        {/* haze nhẹ để đom đóm hòa vào nền + blur nhẹ ảnh */}
        <div className="absolute inset-0 backdrop-blur-[1.2px]" />
      </div>

      {/* Content */}
      <div
        className="
          relative z-10
          flex h-full flex-col items-center justify-center text-center
          px-6
          pt-24 md:pt-0
        "
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
            whitespace-nowrap
            font-semibold tracking-[-0.02em]
            text-white
            drop-shadow-[0_0_28px_rgba(0,0,0,0.65)]
          "
          style={{
            fontSize: "clamp(28px, 6vw, 76px)",
            lineHeight: 1.05,
          }}
        >
          Đèn Trang Trí Ngoài Trời
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="
            mt-5 md:mt-6
            mx-auto
            text-lg sm:text-xl md:text-2xl
            font-medium tracking-[-0.01em]
            text-white/95
            drop-shadow-[0_0_18px_rgba(0,0,0,0.55)]
          "
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
            <span className="whitespace-nowrap">Không những</span>
            <GlowWord>Sáng</GlowWord>
            <span className="whitespace-nowrap">mà còn phải</span>
            <GlowWord>Xênh</GlowWord>
          </span>
        </motion.p>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 80 }}
          animate={{
            opacity: 1,
            y: 0,
            // pulse gây chú ý (liên tục)
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 1.4,
            // pulse loop nhẹ
            scale: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 },
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleScrollToProducts}
          className="
            relative
            mt-9 md:mt-12
            px-8 py-4 md:px-10 md:py-4.5
            rounded-full
            text-white font-semibold text-lg md:text-xl
            bg-gradient-to-r from-[#0F5C63] to-[#0B8A92]
            shadow-[0_0_48px_rgba(255,214,107,0.28)]
            border border-white/20
            overflow-hidden
          "
        >
          {/* glow nền */}
          <span
            aria-hidden
            className="
              absolute -inset-6
              rounded-full
              bg-[#FFD66B]/12
              blur-2xl
              opacity-80
            "
          />

          {/* shimmer chạy ngang (subtle) */}
          <motion.span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.22) 45%, transparent 80%)",
              transform: "translateX(-120%)",
            }}
            animate={{ transform: ["translateX(-120%)", "translateX(120%)"] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
          />

          <span className="relative drop-shadow-[0_0_14px_rgba(255,214,107,0.55)]">
            Khám phá ngay
          </span>
        </motion.button>
      </div>
    </motion.section>
  )
}

/** end code */