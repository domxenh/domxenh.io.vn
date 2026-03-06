// app/layout.tsx
import "./globals.css"
import type { ReactNode } from "react"
import { Suspense } from "react"
import type { Metadata } from "next"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Fireflies from "@/components/Fireflies"

import { Inter, Be_Vietnam_Pro } from "next/font/google"
import CartHost from "../components/cart/CartHost"

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

const SITE = {
  base: "https://www.domxenh.io.vn",
  title: "ĐÓM XÊNH | Đèn trang trí ngoài trời",
  description: "Không những Sáng mà còn phải Xênh.",
  ogDescription: "Đèn trang trí ngoài trời – vibe ấm, bền đẹp, dễ lắp đặt.",
  ogImage: "/og/og-home.png",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.base),
  title: SITE.title,
  description: SITE.description,

  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    url: SITE.base,
    siteName: "ĐÓM XÊNH",
    title: SITE.title,
    description: SITE.ogDescription,
    locale: "vi_VN",
    images: [
      { url: SITE.ogImage, width: 1200, height: 630, alt: "ĐÓM XÊNH" },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.ogDescription,
    images: [SITE.ogImage],
  },

  // ✅ FAVICON (Google lấy logo ở đây)
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.webp", sizes: "32x32", type: "image/webp" },
      { url: "/favicon-16x16.webp", sizes: "16x16", type: "image/webp" },
    ],
    apple: [{ url: "/apple-touch-icon.webp", sizes: "180x180", type: "image/webp" }],
    shortcut: ["/favicon.ico"],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVN.variable}`}>
      <body>
        <Suspense fallback={<div aria-hidden style={{ height: "92px" }} />}>
          <Header />
        </Suspense>

        <Fireflies />

        {children}

        <CartHost />

        <Footer />
      </body>
    </html>
  )
}