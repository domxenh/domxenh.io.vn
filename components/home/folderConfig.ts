// components/home/folderConfig.ts
// Cấu hình folder ở trang chủ (curated)

/**
 * TÓM TẮT:
 * - Đổi match sản phẩm từ productNames -> productSlugs (ổn định hơn).
 * - Slug lấy theo prisma/seed.ts hiện tại.
 */

export const HOME_PRODUCT_FOLDERS = [
  {
    title: "Bộ dây đèn Edison",
    desc: "Ánh vàng ấm, vibe cổ điển – lắp là xênh.",
    productSlugs: [
      "bo-day-den-edison",
      "bo-day-den-edison-1-toc",
      "bo-day-den-edison-2-toc",
    ],
  },
  {
    title: "Bộ dây đèn bóng Tròn",
    desc: "Nhẹ nhàng hiện đại – nhiều mức công suất.",
    productSlugs: [
      "bo-day-den-bong-tron-3w",
      "bo-day-den-bong-tron-5w",
      "bo-day-den-bong-tron-7w",
      "bo-day-den-bong-tron-9w",
    ],
  },
  {
    title: "Dây lẻ - Bóng lẻ",
    desc: "Phụ kiện thay thế & nâng cấp theo nhu cầu.",
    productSlugs: ["day-le", "bong-le"],
  },
] as const

// end code