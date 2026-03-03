// app/layout.tsx
/**
 * TÓM TẮT (VN):
 * - Tối ưu font theo phong cách Apple cho tiếng Việt: ưu tiên SF Pro (system font trên iOS/macOS),
 *   fallback Inter + Be Vietnam Pro (ổn định trên Windows/Android) bằng next/font để preload nhẹ và nhanh.
 * - Không thay đổi cấu trúc layout hiện có (Header/Fireflies/CartHost/Footer giữ nguyên).
 *
 * NƠI CHỈNH:
 * - Thêm next/font/google + cấu hình font (Inter, Be_Vietnam_Pro)
 * - Gắn className vào <html> để kích hoạt biến CSS font
 */
import "./globals.css"
import type { ReactNode } from "react"
import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Fireflies from "@/components/Fireflies"

// ✅ CHỈNH: thêm font tối ưu (Apple-like + hỗ trợ tiếng Việt tốt)
import { Inter, Be_Vietnam_Pro } from "next/font/google"

// ✅ dùng relative để chắc chắn không lỗi alias
import CartHost from "../components/cart/CartHost"

// ✅ CHỈNH: cấu hình font (nhẹ, preload tự động, display=swap)
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
})

const beVN = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bevn",
  display: "swap",
})

export const metadata = {
  metadataBase: new URL("https://domxenh.io.vn"),
  openGraph: { images: ["/icon.png"] },
  twitter: { images: ["/icon.png"] },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // ✅ CHỈNH: gắn biến font lên <html> (không ảnh hưởng layout cũ)
    <html lang="vi" className={`${inter.variable} ${beVN.variable}`}>
      <body>
        <Suspense fallback={<div aria-hidden style={{ height: "92px" }} />}>
          <Header />
        </Suspense>

        <Fireflies />

        {children}

        {/* ✅ icon giỏ nổi + popup giỏ hàng */}
        <CartHost />

        <Footer />
      </body>
    </html>
  )
}

// end code