import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export const metadata = {
  title: "Dây Lẻ Bóng Lẻ | DOMXENH",
  description: "Dây đèn ngoài trời, bóng lẻ thay thế chất lượng cao."
}

export default async function DayLePage() {
  const products = await prisma.product.findMany({
    where: {
      category: {
        slug: "day-le-bong-le"
      }
    }
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold">
        Dây Lẻ Bóng Lẻ
      </h1>

      <div className="grid grid-cols-4 gap-6 mt-8">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}