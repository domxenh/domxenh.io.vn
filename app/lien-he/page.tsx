import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export const metadata = {
  title: "Đèn Trang Trí Ngoài Trời | DOMXENH",
  description: "Chuyên đèn ngoài trời cao cấp, giá tốt."
}

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" }
  })

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">
        Đèn Trang Trí Ngoài Trời Cao Cấp
      </h1>

      <div className="grid grid-cols-4 gap-6 mt-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}