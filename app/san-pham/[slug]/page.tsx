// app/san-pham/[slug]/page.tsx
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/lib/products"

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) return notFound()

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold text-white">{product.name}</h1>
      {/* render chi tiết ở đây */}
    </main>
  )
}