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

export type ProductDetailDTO = {
  id: string
  slug: string
  name: string
  image: string
  price: number
  oldPrice: number | null
  isHot: boolean
  description: string
  stock: number
  category: {
    id: string
    name: string
    slug: string
    image: string | null
  }
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

const selectDetail = {
  id: true,
  slug: true,
  name: true,
  image: true,
  price: true,
  oldPrice: true,
  isHot: true,
  description: true,
  stock: true,
  category: {
    select: { id: true, name: true, slug: true, image: true },
  },
} as const

// cache nhẹ
const cachedProductBySlug = unstable_cache(
  async (slug: string) =>
    prisma.product.findUnique({ where: { slug }, select: selectDetail }),
  ["products:detailBySlug"],
  { revalidate: 120 }
)

const cachedRelatedByCategory = unstable_cache(
  async (categoryId: string, excludeSlug: string, take: number) =>
    prisma.product.findMany({
      where: { categoryId, slug: { not: excludeSlug } },
      take,
      orderBy: { createdAt: "desc" },
      select: selectCard,
    }),
  ["products:relatedByCategory"],
  { revalidate: 120 }
)

export async function getProductsByNames(names: string[]) {
  if (!names?.length) return [] as ProductCardDTO[]
  const products = await prisma.product.findMany({
    where: { name: { in: Array.from(new Set(names)) } },
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

export async function getProductsBySlugs(slugs: string[]) {
  if (!slugs?.length) return [] as ProductCardDTO[]
  const unique = Array.from(new Set(slugs))
  const products = await prisma.product.findMany({
    where: { slug: { in: unique } },
    select: selectCard,
  })
  const map = new Map(products.map((p) => [p.slug, p]))
  return unique.map((s) => map.get(s)).filter(Boolean) as ProductCardDTO[]
}

export async function getProductBySlug(slug: string) {
  if (!slug) return null
  const product = await cachedProductBySlug(slug)
  return product as ProductDetailDTO | null
}

export async function getRelatedProductsByCategory(opts: {
  categoryId: string
  excludeSlug: string
  take?: number
}) {
  const take = Math.max(1, Math.min(opts.take ?? 8, 12))
  const items = await cachedRelatedByCategory(opts.categoryId, opts.excludeSlug, take)
  return items as ProductCardDTO[]
}

// end code