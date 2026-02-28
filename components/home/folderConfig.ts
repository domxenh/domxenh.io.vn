// components/home/folderConfig.ts
// TÓM TẮT (ver 1.4):
// - Thêm key cho mỗi folder để lọc theo query ?cat=...
// - productSlugs giữ nguyên
//
// cat keys:
// - edison
// - tron
// - day-le-bong-le

export const HOME_PRODUCT_FOLDERS = [
  {
    key: "edison",
    title: "Bộ dây đèn EDISON",
    desc: "Ánh vàng ấm, vibe cổ điển – lắp là xênh.",
    productSlugs: [
      "bo-day-den-edison",
      "bo-day-den-edison-1-toc",
      "bo-day-den-edison-2-toc",
    ],
  },
  {
    key: "tron",
    title: "Bộ dây đèn Tròn",
    desc: "Nhẹ nhàng hiện đại – nhiều mức công suất.",
    productSlugs: [
      "bo-day-den-bong-tron-3w",
      "bo-day-den-bong-tron-5w",
      "bo-day-den-bong-tron-7w",
      "bo-day-den-bong-tron-9w",
    ],
  },
  {
    key: "day-le-bong-le",
    title: "Dây lẻ, Bóng lẻ",
    desc: "Phụ kiện thay thế & nâng cấp theo nhu cầu.",
    productSlugs: ["day-le", "bong-le"],
  },
] as const

// end code