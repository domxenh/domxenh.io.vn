// app/layout.tsx
import "./globals.css"
import type { ReactNode } from "react"
import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Fireflies from "@/components/Fireflies"

// ✅ dùng relative để chắc chắn không lỗi alias
import CartHost from "../components/cart/CartHost"

export const metadata = {
  metadataBase: new URL("https://domxenh.io.vn"),
  openGraph: { images: ["/icon.png"] },
  twitter: { images: ["/icon.png"] },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
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