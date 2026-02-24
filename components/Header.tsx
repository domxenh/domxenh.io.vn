"use client"

/*
CODE: Header Apple dark
- Logo trái
- Menu chữ to
- Hover animation
- Blur glass effect
*/

import { useEffect, useState } from "react"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50
      w-[90%] max-w-6xl px-10 py-5 rounded-full
      flex justify-between items-center
      transition-all duration-300
      ${
        scrolled
          ? "backdrop-blur-xl bg-white/10 shadow-2xl"
          : "bg-white/5"
      }`}

    >
      {/* LOGO */}
      <div className="text-2xl font-semibold tracking-tight">
        ĐÓM XÊNH
      </div>

      {/* MENU */}
      <nav className="flex gap-10 text-lg font-medium">
        {["Trang chủ", "Edison", "Đèn Tròn", "Dây & Bóng"].map(
          (item, index) => (
            <a
              key={index}
              href="#"
              className="relative group transition-all duration-300 hover:scale-110"
            >
              {item}

              {/* underline animation */}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          )
        )}
      </nav>
    </header>
  )
}

// end code