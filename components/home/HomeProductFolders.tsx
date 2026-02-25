// components/home/HomeProductFolders.tsx
import FadeInSection from "@/components/FadeInSection"
import ProductCard from "@/components/ProductCard"
import { HOME_PRODUCT_FOLDERS } from "@/components/home/folderConfig"
import { getProductsByNames } from "@/lib/products"

/**
 * TÓM TẮT:
 * - Render 3 folder lớn trên trang chủ.
 * - Mỗi folder lấy đúng sản phẩm theo danh sách name (curated).
 * - Không phụ thuộc category/products full trong DB => tách bạch với trang catalog.
 */

export default async function HomeProductFolders() {
  const allNames = HOME_PRODUCT_FOLDERS.flatMap((f) => [...f.productNames])
  const products = await getProductsByNames(allNames)
  const byName = new Map(products.map((p) => [p.name, p]))

  return (
    <section className="section-alt">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {HOME_PRODUCT_FOLDERS.map((folder) => {
          const readyCount = folder.productNames.filter((n) => byName.has(n)).length

          return (
            <FadeInSection key={folder.title}>
              <div
                className="
                  relative overflow-hidden
                  rounded-[32px]
                  border border-white/10
                  bg-gradient-to-b from-white/10 to-white/5
                  shadow-[0_40px_120px_rgba(0,0,0,0.65)]
                  backdrop-blur-2xl
                  p-6 md:p-8
                "
              >
                <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFD66B]/10 blur-3xl" />

                <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.35)]">
                      {folder.title}
                    </h2>
                    <p className="mt-2 text-white/70 max-w-2xl">{folder.desc}</p>
                  </div>

                  <div className="text-white/50 text-sm">
                    {readyCount}/{folder.productNames.length} sản phẩm
                  </div>
                </div>

                <div className="relative mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {folder.productNames.map((name) => {
                    const p = byName.get(name)

                    if (!p) {
                      return (
                        <div
                          key={name}
                          className="rounded-3xl border border-white/10 bg-black/20 p-5 text-white/60"
                        >
                          <div className="text-sm text-white/50">Chưa có dữ liệu</div>
                          <div className="mt-2 font-semibold text-white/80">{name}</div>
                          <div className="mt-3 text-xs text-white/45">
                            Thêm sản phẩm này vào seed/DB.
                          </div>
                        </div>
                      )
                    }

                    return <ProductCard key={p.id} product={p} variant="compact" />
                  })}
                </div>
              </div>
            </FadeInSection>
          )
        })}
      </div>
    </section>
  )
}

// end code