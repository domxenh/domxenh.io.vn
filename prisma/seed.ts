// prisma/seed.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const folder1 = await prisma.category.create({
    data: { name: "Bộ dây đèn Edison", slug: "bo-day-edison" },
  })

  const folder2 = await prisma.category.create({
    data: { name: "Bộ dây đèn bóng Tròn", slug: "bo-day-bong-tron" },
  })

  const folder3 = await prisma.category.create({
    data: { name: "Dây lẻ - Bóng lẻ", slug: "day-le-bong-le" },
  })

  await prisma.product.createMany({
    data: [
      // Folder 1: 3 sản phẩm
      {
        name: "Bộ dây đèn Edison",
        slug: "bo-day-den-edison",
        price: 690000,
        oldPrice: 820000,
        description: "Bộ dây đèn Edison tiêu chuẩn ngoài trời.",
        image: "/images/den1.jpg",
        stock: 20,
        categoryId: folder1.id,
      },
      {
        name: "Bộ dây đèn Edison 1 tóc",
        slug: "bo-day-den-edison-1-toc",
        price: 790000,
        oldPrice: 890000,
        description: "Phiên bản Edison 1 tóc.",
        image: "/images/den2.jpg",
        stock: 18,
        categoryId: folder1.id,
      },
      {
        name: "Bộ dây đèn Edison 2 tóc",
        slug: "bo-day-den-edison-2-toc",
        price: 890000,
        oldPrice: 1090000,
        description: "Phiên bản Edison 2 tóc.",
        image: "/images/den3.jpg",
        stock: 15,
        categoryId: folder1.id,
      },

      // Folder 2: 4 sản phẩm
      {
        name: "Bộ dây đèn bóng Tròn 3W",
        slug: "bo-day-den-bong-tron-3w",
        price: 590000,
        oldPrice: 690000,
        description: "Bộ dây bóng tròn 3W.",
        image: "/images/den4.jpg",
        stock: 25,
        categoryId: folder2.id,
      },
      {
        name: "Bộ dây đèn bóng Tròn 5W",
        slug: "bo-day-den-bong-tron-5w",
        price: 690000,
        oldPrice: 790000,
        description: "Bộ dây bóng tròn 5W.",
        image: "/images/den5.jpg",
        stock: 22,
        categoryId: folder2.id,
      },
      {
        name: "Bộ dây đèn bóng Tròn 7W",
        slug: "bo-day-den-bong-tron-7w",
        price: 790000,
        oldPrice: 950000,
        description: "Bộ dây bóng tròn 7W.",
        image: "/images/den6.jpg",
        stock: 18,
        categoryId: folder2.id,
      },
      {
        name: "Bộ dây đèn bóng Tròn 9W",
        slug: "bo-day-den-bong-tron-9w",
        price: 890000,
        oldPrice: 1090000,
        description: "Bộ dây bóng tròn 9W.",
        image: "/images/den1.jpg",
        stock: 14,
        categoryId: folder2.id,
      },

      // Folder 3: 2 sản phẩm (đúng list bạn ghi)
      {
        name: "Dây lẻ",
        slug: "day-le",
        price: 59000,
        oldPrice: 79000,
        description: "Dây lẻ để nối dài / thay thế.",
        image: "/images/den2.jpg",
        stock: 100,
        categoryId: folder3.id,
      },
      {
        name: "Bóng lẻ",
        slug: "bong-le",
        price: 45000,
        oldPrice: 52000,
        description: "Bóng lẻ thay thế.",
        image: "/images/den3.jpg",
        stock: 150,
        categoryId: folder3.id,
      },
    ],
  })

  console.log("✅ Seed OK: 3 folder + sản phẩm đúng tên bạn yêu cầu.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => prisma.$disconnect())