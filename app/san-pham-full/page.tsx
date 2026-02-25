// app/san-pham-full/page.tsx
import FadeInSection from "@/components/FadeInSection"
import CatalogGrid from "@/components/catalog/CatalogGrid"

export const metadata = {
  title: "Sản phẩm | ĐÓM XÊNH",
  description: "Danh sách đầy đủ sản phẩm của ĐÓM XÊNH.",
}

export default function SanPhamFullPage() {
  return (
    <main className="min-h-screen pt-36 pb-24 px-6 md:px-10">
      <div className="mx-auto max-w-7xl">
        <FadeInSection>
          <h1 className="text-4xl md:text-5xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.55)]">
            Sản phẩm
          </h1>
          <p className="mt-4 text-white/75 max-w-2xl">
            Đây là trang full catalog (khác với danh mục curated ở trang chủ).
          </p>
        </FadeInSection>

        <div className="mt-10">
          <CatalogGrid />
        </div>
      </div>
    </main>
  )
}

// end code