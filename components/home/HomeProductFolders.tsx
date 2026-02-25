// components/home/HomeProductFolders.tsx
import FadeInSection from "@/components/FadeInSection"
import ProductCard from "@/components/ProductCard"
import { HOME_PRODUCT_FOLDERS } from "@/components/home/folderConfig"
import { getProductsBySlugs } from "@/lib/products"
import Fireflies from "@/components/Fireflies"

export default async function HomeProductFolders() {
  const allSlugs = HOME_PRODUCT_FOLDERS.flatMap((f) => [...f.productSlugs])
  const products = await getProductsBySlugs(allSlugs)
  const bySlug = new Map(products.map((p) => [p.slug, p]))

  return (
    <section
      id="products"
      className="section-alt relative overflow-hidden !pt-8 md:!pt-12 !pb-8 md:!pb-12"
      style={{
        backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url('/images/catalog.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Fireflies background layer */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-70">
        <Fireflies />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-10">
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

                {/* Header căn giữa */}
                <div className="relative flex flex-col items-center text-center gap-3">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.35)]">
                      {folder.title}
                    </h2>
                    <p className="mt-2 text-white/70 max-w-2xl mx-auto">
                      {folder.desc}
                    </p>
                  </div>
                </div>

                {/* Auto-fit/minmax + card luôn ở giữa */}
                <div
                  className="
                    relative mt-6 grid gap-4 sm:gap-6
                    justify-items-center
                    [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]
                    sm:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]
                  "
                >
                  {folder.productSlugs.map((slug) => {
                    const p = bySlug.get(slug)

                    if (!p) {
                      return (
                        <div
                          key={slug}
                          className="
                            w-full max-w-[260px]
                            rounded-3xl border border-white/10 bg-black/20
                            p-5 text-white/60 text-center
                          "
                        >
                          <div className="text-sm text-white/50">Chưa có dữ liệu</div>
                          <div className="mt-2 font-semibold text-white/80 break-words">
                            {slug}
                          </div>
                          <div className="mt-3 text-xs text-white/45">
                            Kiểm tra seed/DB: đúng slug này chưa.
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