import { prisma } from "@/lib/prisma"
import Hero from "@/components/Hero"
import ProductCard from "@/components/ProductCard"

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="mt-32">

      {/* HERO */}
      <Hero />

      {/* SECTION SẢN PHẨM */}
      <section className="section-alt">
        <div className="max-w-7xl mx-auto px-6
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-12">

          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}

        </div>
        <div className="relative -mt-10 z-20">
          <div className="sticky top-24">
            {/* Component danh sách sản phẩm của anh */}
          </div>
        </div>
      </section>

    </div>
  )
}