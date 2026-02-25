// lib/products.ts
// TÓM TẮT (ver 1.3+ QuickView):
// - Giữ getAllProducts
// - getProductsBySlugs match theo slug
// - Bổ sung description để Quick View modal dùng được ngay trên Home + Catalog

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
  description: string // ✅ thêm để modal hiển thị mô tả
}

const selectCard = {
  id: true,
  slug: true,
  name: true,
  image: true,
  price: true,
  oldPrice: true,
  isHot: true,
  description: true, // ✅ thêm
} as const

// ✅ match theo slug (ổn định hơn name)
export const getAllProducts = cache(async () => {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: selectCard,
  })
})

export const getProductsBySlugs = cache(async (slugs: string[]) => {
  if (!slugs?.length) return []
  return prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: selectCard,
  })
})

// Trang chi tiết riêng (nếu còn dùng)
export async function getProductBySlug(slug: string) {
  if (!slug) return null
  return prisma.product.findUnique({
    where: { slug },
  })
}