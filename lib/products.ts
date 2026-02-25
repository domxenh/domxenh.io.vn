// lib/products.ts
// TÓM TẮT (ver 1.3):
// - Giữ getAllProducts như cũ
// - Thêm getProductsBySlugs để Home folder match theo slug (fix lỗi lệch name)
//
// CHỖ CẦN CHỈNH:
// - Nếu bạn muốn ProductCard lấy thêm field khác (ví dụ category.name) thì bổ sung selectCard.

import { prisma } from "@/lib/prisma"

export type ProductCardDTO = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  oldPrice: number | null
  isHot: boolean
}

const selectCard = {
  id: true,
  slug: true,
  name: true,
  image: true,
  price: true,
  oldPrice: true,
  isHot: true,
} as const

// ✅ ver 1.3: match theo slug (ổn định hơn name)
export async function getProductsBySlugs(slugs: string[]) {
  if (!slugs?.length) return []
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: selectCard,
  })
  return products as ProductCardDTO[]
}

// (giữ lại nếu nơi khác đang dùng)
// export async function getProductsByNames(names: string[]) {
//   if (!names?.length) return []
//   const products = await prisma.product.findMany({
//     where: { name: { in: names } },
//     select: selectCard,
//   })
//   return products as ProductCardDTO[]
// }

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: selectCard,
  })
  return products as ProductCardDTO[]
}

// end code