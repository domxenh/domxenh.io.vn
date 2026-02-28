// app/page.tsx
import Hero from "@/components/Hero"
import HomeProductFolders from "@/components/home/HomeProductFolders"

export const metadata = {
  title: "ĐÓM XÊNH | Đèn trang trí ngoài trời",
  description: "Không những Sáng mà còn phải Xênh.",
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HomeProductFolders />
    </main>
  )
}

// end code