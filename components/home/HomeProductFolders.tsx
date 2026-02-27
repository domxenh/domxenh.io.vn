// components/home/HomeProductFolders.tsx
import FadeInSection from "@/components/FadeInSection"
import ProductCard from "@/components/ProductCard"
import { HOME_PRODUCT_FOLDERS } from "@/components/home/folderConfig"
import Fireflies from "@/components/Fireflies"
import { getProductsBySlugs } from "@/lib/products"

/**
 * TÓM TẮT:
 * - Render 3 folder lớn trên trang chủ (curated).
 * - Match sản phẩm theo SLUG (ổn định hơn name).
 * - Section có nền ảnh hero-outdoor.png + overlay để nổi card.
 * - Grid dùng auto-fit/minmax để tự co cột, card căn giữa.
 * - Bỏ counter 3/3 sản phẩm theo yêu cầu v1.3.
 */

export default async function HomeProductFolders() {
  const allSlugs = HOME_PRODUCT_FOLDERS.flatMap((f) => [...f.productSlugs])
  const products = await getProductsBySlugs(allSlugs)
  const bySlug = new Map(products.map((p) => [p.slug, p]))

  return (
    <section
      id="products"
      className="relative overflow-hidden py-16 md:py-20"
      style={{
        backgroundImage: "url('/images/hero-outdoor.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,214,107,0.10),transparent_55%)]" />

      {/* Fireflies: chỉ desktop để nhẹ mobile */}
      <div className="hidden md:block">
        <Fireflies variant="hero" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 md:px-6 space-y-10">
        {/* Title khu vực danh mục */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.22)]">
            Danh mục sản phẩm
          </h2>
        </div>

        {HOME_PRODUCT_FOLDERS.map((folder) => {
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

                <div className="relative text-center">
                  <h3 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.28)]">
                    {folder.title}
                  </h3>
                  <p className="mt-2 text-white/70 max-w-2xl mx-auto">{folder.desc}</p>
                </div>

                <div
                  className="
                    relative mt-7 grid gap-6
                    [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]
                    md:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]
                    justify-items-center
                  "
                >
                  {folder.productSlugs.map((slug) => {
                    const p = bySlug.get(slug)

                    if (!p) {
                      return (
                        <div
                          key={slug}
                          className="w-full max-w-[320px] rounded-3xl border border-white/10 bg-black/20 p-5 text-white/60"
                        >
                          <div className="text-sm text-white/50">Chưa có dữ liệu</div>
                          <div className="mt-2 font-semibold text-white/80">{slug}</div>
                          <div className="mt-3 text-xs text-white/45">
                            Kiểm tra seed/DB (slug) hoặc folderConfig.
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