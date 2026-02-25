// lib/products.ts
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

export async function getAllProducts() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: selectCard,
  })
  return products as ProductCardDTO[]
}

// end code