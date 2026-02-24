// Code 1
// prisma/seed.ts
// File này dùng để thêm dữ liệu mẫu vào database

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ (nếu có)
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Tạo category
  const sanVuon = await prisma.category.create({
    data: {
      name: "Đèn LED Sân Vườn",
      slug: "den-led-san-vuon",
    },
  });

  const trangTri = await prisma.category.create({
    data: {
      name: "Đèn Trang Trí",
      slug: "den-trang-tri",
    },
  });

  const congNghiep = await prisma.category.create({
    data: {
      name: "Đèn Công Nghiệp",
      slug: "den-cong-nghiep",
    },
  });

  // Tạo sản phẩm
  await prisma.product.createMany({
    data: [
      {
        name: "Đèn Cắm Cỏ 5W",
        slug: "den-cam-co-5w",
        price: 350000,
        description: "Đèn LED cắm cỏ ngoài trời chống nước IP65",
        image: "/images/den1.jpg",
        stock: 20,
        categoryId: sanVuon.id,
      },
      {
        name: "Đèn Âm Đất 9W",
        slug: "den-am-dat-9w",
        price: 420000,
        description: "Đèn âm đất chiếu sáng lối đi sân vườn",
        image: "/images/den2.jpg",
        stock: 15,
        categoryId: sanVuon.id,
      },
      {
        name: "Đèn Chùm Pha Lê",
        slug: "den-chum-pha-le",
        price: 2500000,
        description: "Đèn chùm trang trí phòng khách cao cấp",
        image: "/images/den3.jpg",
        stock: 5,
        categoryId: trangTri.id,
      },
      {
        name: "Đèn Thả Trần Hiện Đại",
        slug: "den-tha-tran-hien-dai",
        price: 1800000,
        description: "Đèn thả trần phong cách hiện đại",
        image: "/images/den4.jpg",
        stock: 10,
        categoryId: trangTri.id,
      },
      {
        name: "Đèn Nhà Xưởng 150W",
        slug: "den-nha-xuong-150w",
        price: 950000,
        description: "Đèn LED công nghiệp siêu sáng",
        image: "/images/den5.jpg",
        stock: 30,
        categoryId: congNghiep.id,
      },
      {
        name: "Đèn Pha LED 200W",
        slug: "den-pha-led-200w",
        price: 1200000,
        description: "Đèn pha LED ngoài trời công suất lớn",
        image: "/images/den6.jpg",
        stock: 12,
        categoryId: congNghiep.id,
      },
    ],
  });

  console.log("Seed thành công!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  // End code 1
  
