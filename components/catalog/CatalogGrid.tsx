// components/catalog/CatalogGrid.tsx
import FadeInSection from "@/components/FadeInSection"
import ProductCard from "@/components/ProductCard"
import { getAllProducts } from "@/lib/products"

export default async function CatalogGrid() {
  const products = await getAllProducts()

  return (
    <FadeInSection>
      <div
        className="
          grid gap-4 sm:gap-6
          justify-items-center
          [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]
          sm:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]
          lg:[grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]
        "
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} variant="default" />
        ))}
      </div>
    </FadeInSection>
  )
}

// end code