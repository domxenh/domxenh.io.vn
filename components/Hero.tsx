/**
 * HERO CINEMATIC RESTORE + APPLE PRO
 *
 * - Khôi phục fade + slide animation
 * - Khôi phục glow chữ "Xênh."
 * - Khôi phục button glow
 * - Giữ shrink 90vh → 20vh
 * - Giữ parallax background
 * - Giữ text scale riêng
 * - Giữ border radius khi co
 */

"use client"

import { motion, useScroll, useTransform } from "framer-motion"

export default function Hero() {
  const { scrollY } = useScroll()

  // Hero height
  const height = useTransform(scrollY, [0, 500], ["90vh", "20vh"])
  const radius = useTransform(scrollY, [0, 500], ["0px", "32px"])

  // Background parallax
  const bgY = useTransform(scrollY, [0, 500], [0, -120])
  const bgScale = useTransform(scrollY, [0, 500], [1, 1.1])

  // Text transform riêng
  const textScale = useTransform(scrollY, [0, 400], [1, 0.75])
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <motion.section
      style={{ height, borderRadius: radius }}
      className="relative w-full overflow-hidden"
    >
      {/* Background */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0"
      >
        <img
          src="/images/hero-outdoor.png"
          alt="Đèn trang trí ngoài trời"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0B1417]" />

      {/* Content */}
      <motion.div
        style={{ scale: textScale, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6"
      >

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_25px_rgba(255,214,107,0.5)]"
        >
          Đèn Trang Trí Ngoài Trời
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-6 text-lg md:text-xl text-[#A8C0C4]"
        >
          Không những sáng mà còn phải{" "}
          <span className="text-[#FFD66B] font-semibold drop-shadow-[0_0_15px_rgba(255,214,107,0.9)]">
            Xênh.
          </span>
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="
            mt-10 px-8 py-4 rounded-full
            bg-gradient-to-r from-[#0F5C63] to-[#0B8A92]
            text-white font-medium
            shadow-[0_0_30px_rgba(15,92,99,0.7)]
          "
        >
          Khám phá ngay
        </motion.button>

      </motion.div>
    </motion.section>
  )
}

/**
 * END HERO CINEMATIC RESTORE
 */