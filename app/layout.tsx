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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <ProductQuickViewProvider>
          <Header />

          {/* Apple không dùng container cố định */}
          {children}

          <Footer />
        </ProductQuickViewProvider>
      </body>
    </html>
  )
}