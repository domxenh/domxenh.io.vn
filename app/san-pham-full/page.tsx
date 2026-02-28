// app/san-pham-full/page.tsx
import HomeProductFolders from "@/components/home/HomeProductFolders"

export const metadata = {
  title: "Sản phẩm | ĐÓM XÊNH",
  description: "Danh mục sản phẩm của ĐÓM XÊNH.",
}

export default async function SanPhamFullPage({
  searchParams,
}: {
  searchParams?: { cat?: string } | Promise<{ cat?: string }>
}) {
  const sp = await Promise.resolve(searchParams ?? {})
  const cat = sp.cat

  return (
    // ✅ Bỏ header tiêu đề trang, chỉ chừa khoảng trống cho menu (header fixed)
    <main className="min-h-screen pt-28 md:pt-32">
      <HomeProductFolders cat={cat} />
    </main>
  )
}

// end code