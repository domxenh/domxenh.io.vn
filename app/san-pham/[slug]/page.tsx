/*
CODE: Product detail kiểu Apple Store
- Layout rộng
- Hình bên trái lớn
- Thông tin bên phải
- Sticky buy
*/

import { prisma } from "@/lib/prisma"

export default async function ProductDetail({ params }: any) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug }
  })

  if (!product) return <div>Không tìm thấy sản phẩm</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-20">

      {/* HÌNH ẢNH */}
      <div className="sticky top-40 h-fit">
        <img
          src={product.image}
          className="rounded-3xl shadow-xl"
        />
      </div>

      {/* INFO */}
      <div>
        <h1 className="text-5xl font-semibold tracking-tight">
          {product.name}
        </h1>

        <p className="mt-6 text-gray-600 text-lg">
          {product.description}
        </p>

        <div className="mt-10 text-3xl font-medium">
          {product.price.toLocaleString()} đ
        </div>

        <button className="mt-8 px-8 py-4 bg-black text-white rounded-full text-lg hover:opacity-80 transition">
          Mua ngay
        </button>
      </div>
      
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-2xl md:hidden">
        <button className="w-full bg-black text-white py-4 rounded-full">
          Mua ngay
        </button>
      </div>
      
    </div>
  )
}
