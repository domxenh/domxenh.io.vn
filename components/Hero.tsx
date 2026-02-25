/**
 * Tóm tắt (VI):
 * - Hero tĩnh (không scroll animation)
 * - Đồng bộ ảnh nền với Header: dùng /images/Header.jpg
 * - Set CSS var --hero-bg để header có thể dùng cùng ảnh hero (tạo cảm giác liền mạch)
 * - Mobile tối ưu: chiều cao hero thấp hơn, thêm padding-top để không bị header che,
 *   font/button scale hợp lý, object-position đẹp hơn.
 * - Nút "Khám phá ngay" scroll mượt xuống section sản phẩm id="products"
 *
 * Chỗ cần chỉnh:
 * - TARGET_ID: id section sản phẩm
 * - HERO_BG: ảnh nền hero (đang dùng Header.jpg)
 * - HERO_HEIGHT: chiều cao responsive
 */

"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"
import { useEffect } from "react"
import Fireflies from "@/components/Fireflies"

function GlowWord({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block font-semibold text-[#FFD66B]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-md opacity-70 text-[#FFD66B]"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-35 text-[#FFD66B]"
      >
        {children}
      </span>
      <span className="relative drop-shadow-[0_0_18px_rgba(255,214,107,0.95)]">
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
  const HERO_HEIGHT = "h-[72vh] sm:h-[78vh] md:h-[90vh]"

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

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-[#0B1417]" />

      {/* Fireflies layer */}
      <div className="absolute inset-0">
        <Fireflies variant="hero" />
        {/* haze nhẹ để đom đóm hòa vào nền */}
        <div className="absolute inset-0 backdrop-blur-[0.6px]" />
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
            text-3xl sm:text-4xl md:text-6xl
            font-bold text-white
            drop-shadow-[0_0_25px_rgba(255,214,107,0.5)]
          "
        >
          Đèn Trang Trí Ngoài Trời
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-5 md:mt-6 text-base sm:text-lg md:text-xl text-[#A8C0C4]"
        >
          Không những <GlowWord>Sáng</GlowWord> mà còn phải{" "}
          <GlowWord>Xênh</GlowWord>
        </motion.p>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleScrollToProducts}
          className="
            mt-8 md:mt-10
            px-7 py-3.5 md:px-8 md:py-4
            rounded-full
            bg-gradient-to-r from-[#0F5C63] to-[#0B8A92]
            text-white font-medium
            shadow-[0_0_30px_rgba(15,92,99,0.7)]
          "
        >
          Khám phá ngay
        </motion.button>
      </div>
    </motion.section>
  )
}

/** end code */