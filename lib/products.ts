// lib/products.ts ver2.1 https://github.com/domxenh/domxenh.io.vn/blob/main/lib/products.ts
import { prisma } from "@/lib/prisma"
import { cache } from "react"

/**
 * TÓM TẮT:
 * - Thêm cache() để tránh query lặp trong server render tree.
 * - Thêm getProductsBySlugs (match theo slug ổn định hơn name).
 * - Include description để Quick View modal dùng được.
 */

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

export const getProductsByNames = cache(async (names: string[]) => {
  const products = await prisma.product.findMany({
    where: { name: { in: names } },
    select: selectCard,
  })
  return products as ProductCardDTO[]
})

export const getProductsBySlugs = cache(async (slugs: string[]) => {
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

export const getProductBySlug = cache(async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    select: selectCard,
  })
  return product as ProductCardDTO | null
})

// end code