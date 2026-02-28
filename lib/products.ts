// lib/products.ts
/**
 * TÓM TẮT (VN):
 * - FIX lỗi build do lib/products.ts bị dán nhầm JSX (<html>, <body>...).
 * - File này CHỈ chứa các hàm query Prisma.
 * - Bổ sung getProductsBySlugs để HomeProductFolders.tsx dùng theo slug.
 *
 * CHỖ SỬA:
 * - Đảm bảo KHÔNG có JSX trong file này.
 */

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

export async function getProductsByNames(names: string[]) {
  const products = await prisma.product.findMany({
    where: { name: { in: names } },
    select: selectCard,
  })
  return products as ProductCardDTO[]
}

/** ✅ NEW: Query theo slug để khớp folderConfig dùng productSlugs */
export async function getProductsBySlugs(slugs: string[]) {
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    select: selectCard,
  })
  return products as ProductCardDTO[]
}

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: selectCard,
  })
  return products as ProductCardDTO[]
}

// end code