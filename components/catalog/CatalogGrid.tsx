// components/catalog/CatalogGrid.tsx
/**
 * - Grid trang /san-pham-full: lấy toàn bộ sản phẩm từ DB.
 * - KHÔNG dùng QuickView, chỉ render ProductCard.
 *
 * FIX UI:
 * - Grid cols theo breakpoint để không bị đè/overlap khi màn hẹp
 */

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
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          items-stretch
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