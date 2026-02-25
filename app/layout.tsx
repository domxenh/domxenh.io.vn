// app/layout.tsx
// ======================================
// Layout full width kiểu Apple
// - Hero / page full màn hình
// - Có Header/Footer
// - Bọc ProductQuickViewProvider để Quick View mở trên mọi trang
// ======================================

import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductQuickViewProvider from "@/components/product/ProductQuickViewProvider"

export const metadata = {
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