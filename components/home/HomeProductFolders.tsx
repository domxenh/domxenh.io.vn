// components/home/HomeProductFolders.tsx
import FadeInSection from "@/components/FadeInSection"
import ProductCard from "@/components/ProductCard"
import { HOME_PRODUCT_FOLDERS } from "@/components/home/folderConfig"
import { getProductsBySlugs } from "@/lib/products"

export default async function HomeProductFolders({
  cat,
  disableAnimations = false,
}: {
  cat?: string
  disableAnimations?: boolean
}) {
  const filtered =
    cat && HOME_PRODUCT_FOLDERS.some((f) => f.key === cat)
      ? HOME_PRODUCT_FOLDERS.filter((f) => f.key === cat)
      : HOME_PRODUCT_FOLDERS

  const allSlugs = filtered.flatMap((f) => [...f.productSlugs])
  const products = await getProductsBySlugs(allSlugs)
  const bySlug = new Map(products.map((p) => [p.slug, p]))

  const CATALOG_BG = "/images/hero-outdoor.webp"

  const Wrap = ({ children }: { children: React.ReactNode }) => {
    if (disableAnimations) return <>{children}</>
    return <FadeInSection>{children}</FadeInSection>
  }

  return (
    <section
      id="products"
      className="section-alt scroll-mt-header relative overflow-hidden !pt-8 md:!pt-12 !pb-8 md:!pb-12"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url('${CATALOG_BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-10">
        {filtered.map((folder) => (
          <Wrap key={folder.title}>
            <div id={`cat-${folder.key}`} className="scroll-mt-header" />

            <div
              className="
                relative overflow-hidden
                rounded-[32px]
                border border-white/10
                bg-gradient-to-b from-white/10 to-white/5
                backdrop-blur-md md:backdrop-blur-2xl
                shadow-[0_25px_80px_rgba(0,0,0,0.55)] md:shadow-[0_40px_120px_rgba(0,0,0,0.65)]
                p-6 md:p-8
              "
            >
              <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FFD66B]/10 blur-3xl" />

              <div className="relative flex flex-col items-center text-center gap-3">
                <div>
                  {/* ✅ Title nổi bật hơn nhưng không lạc tone */}
                  <h2
                    className="
                      text-2xl md:text-3xl font-semibold
                      text-[#FFD66B]
                      drop-shadow-[0_0_22px_rgba(255,214,107,0.55)]
                    "
                  >
                    {folder.title}
                  </h2>

                  <p className="mt-2 text-white/70 max-w-2xl mx-auto">
                    {folder.desc}
                  </p>
                </div>
              </div>

              <div
                className="
                  relative mt-6 grid gap-4 sm:gap-6
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  items-stretch
                "
              >
                {folder.productSlugs.map((slug) => {
                  const p = bySlug.get(slug)

                  if (!p) {
                    return (
                      <div
                        key={slug}
                        className="
                          w-full
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

                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      variant="compact"
                      disableMotion={disableAnimations}
                    />
                  )
                })}
              </div>
            </div>
          </Wrap>
        ))}
      </div>
    </section>
  )
}

// end code