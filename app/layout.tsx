// app/layout.tsx
import "./globals.css"
import type { ReactNode } from "react"
import { Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Fireflies from "@/components/Fireflies"

export const metadata = {
  metadataBase: new URL("https://domxenh.io.vn"), // đổi sang domain thật của bạn nếu cần
  openGraph: {
    images: ["/icon.png"],
  },
  twitter: {
    images: ["/icon.png"],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        {/* ✅ FIX build: Header dùng useSearchParams => bọc Suspense */}
        <Suspense
          fallback={
            // fallback nhẹ để tránh giật layout khi Header chưa hydrate
            <div
              aria-hidden
              style={{ height: "92px" }}
            />
          }
        >
          <Header />
        </Suspense>

        {/* ✅ Fireflies GLOBAL: chỉ render 1 lần cho toàn site */}
        <Fireflies />

        {children}

        <Footer />
      </body>
    </html>
  )
}