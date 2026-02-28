// app/san-pham-full/page.tsx
import HomeProductFolders from "@/components/home/HomeProductFolders"

export const metadata = {
  title: "Sản phẩm | ĐÓM XÊNH",
  description: "Danh mục sản phẩm của ĐÓM XÊNH.",
}

// ✅ cache route (giảm load lại khi click)
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
      <HomeProductFolders cat={cat} />
    </main>
  )
}

// end code