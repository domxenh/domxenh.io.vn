import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export const metadata = {
  title: "Đèn Ngoài Trời Tròn | DOMXENH",
  description: "Đèn ngoài trời tròn chống nước, bền bỉ."
}

export default async function TronPage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: "den-ngoai-troi-tron"
      }
    }
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">
        Đèn Ngoài Trời Tròn
      </h1>

      <div className="grid grid-cols-4 gap-6 mt-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}