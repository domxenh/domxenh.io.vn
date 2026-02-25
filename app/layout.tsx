// ======================================
// CODE: Layout full width kiểu Apple
// - Không bọc container cố định
// - Hero full màn hình
// ======================================

import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <Header />

        {/* ❌ BỎ container mx-auto */}
        {/* Apple không dùng container cố định */}

        {children}

        <Footer />
      </body>
    </html>
  )
}

// end code

// app/layout.tsx
export const metadata = {
  openGraph: {
    images: ["/icon.png"],
  },
  twitter: {
    images: ["/icon.png"],
  },
}