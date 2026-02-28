// app/san-pham-full/page.tsx
import HomeProductFolders from "@/components/home/HomeProductFolders"

export const metadata = {
  title: "Sản phẩm | ĐÓM XÊNH",
  description: "Danh mục sản phẩm của ĐÓM XÊNH.",
}

export const revalidate = 120

export default async function SanPhamFullPage({
  searchParams,
}: {
  searchParams?: { cat?: string } | Promise<{ cat?: string }>
}) {
  const sp = await Promise.resolve(searchParams ?? {})
  const cat = sp.cat

  return (
    <main className="min-h-screen pt-28 md:pt-32">
      {/* ✅ tắt animation để giảm lag hydrate */}
      <HomeProductFolders cat={cat} disableAnimations />
    </main>
  )
}

// end code