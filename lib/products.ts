// lib/products.ts
import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

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

// ✅ Cache helpers (giảm query lại khi chuyển trang)
const cachedFindManyByNames = unstable_cache(
  async (names: string[]) => {
    return prisma.product.findMany({
      where: { name: { in: names } },
      select: selectCard,
    })
  },
  ["products:byNames"],
  { revalidate: 120 }
)

const cachedFindManyAll = unstable_cache(
  async () => {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      select: selectCard,
    })
  },
  ["products:all"],
  { revalidate: 120 }
)

const cachedFindManyBySlugs = unstable_cache(
  async (slugs: string[]) => {
    return prisma.product.findMany({
      where: { slug: { in: slugs } },
      select: selectCard,
    })
  },
  ["products:bySlugs"],
  { revalidate: 120 }
)

export async function getProductsByNames(names: string[]) {
  if (!names || names.length === 0) return [] as ProductCardDTO[]
  const unique = Array.from(new Set(names))
  const products = await cachedFindManyByNames(unique)
  // giữ thứ tự theo config
  const map = new Map(products.map((p) => [p.name, p]))
  return unique.map((n) => map.get(n)).filter(Boolean) as ProductCardDTO[]
}

export async function getProductsBySlugs(slugs: string[]) {
  if (!slugs || slugs.length === 0) return [] as ProductCardDTO[]
  const unique = Array.from(new Set(slugs))
  const products = await cachedFindManyBySlugs(unique)
  const map = new Map(products.map((p) => [p.slug, p]))
  return unique.map((s) => map.get(s)).filter(Boolean) as ProductCardDTO[]
}

export async function getAllProducts() {
  const products = await cachedFindManyAll()
  return products as ProductCardDTO[]
}

// end code