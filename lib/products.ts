// lib/products.ts
import { cache } from "react"
import { prisma } from "@/lib/prisma"

export type ProductCardDTO = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  oldPrice: number | null
  isHot: boolean
  description: string
}

const selectCard = {
  id: true,
  slug: true,
  name: true,
  image: true,
  price: true,
  oldPrice: true,
  isHot: true,
  description: true,
} as const

/**
 * ✅ Cache query để tránh bị gọi lặp trong cùng request tree
 * (đặc biệt khi Home/Catalog render nhiều component con)
 */

// match theo slug (ổn định hơn name)
export const getProductsBySlugs = cache(async (slugs: string[]) => {
  if (!slugs?.length) return []
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: selectCard,
  })
  return products as ProductCardDTO[]
})

export const getAllProducts = cache(async () => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: selectCard,
  })
  return products as ProductCardDTO[]
})

// Trang chi tiết riêng (nếu còn dùng)
export const getProductBySlug = cache(async (slug: string) => {
  if (!slug) return null
  return prisma.product.findUnique({
    where: { slug },
  })
})