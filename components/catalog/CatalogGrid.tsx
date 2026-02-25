// components/catalog/CatalogGrid.tsx
import FadeInSection from "@/components/FadeInSection"
import ProductCard from "@/components/ProductCard"
import { getAllProducts } from "@/lib/products"

export default async function CatalogGrid() {
  const products = await getAllProducts()

  return (
    <FadeInSection>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} variant="default" />
        ))}
      </div>
    </FadeInSection>
  )
}

// end code