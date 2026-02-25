// app/page.tsx
import Hero from "@/components/Hero"
import HomeProductFolders from "@/components/home/HomeProductFolders"

export default function HomePage() {
  return (
    <div className="mt-32">
      <Hero />
      <HomeProductFolders />
    </div>
  )
}

// end code