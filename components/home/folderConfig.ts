// components/home/folderConfig.ts
// TÓM TẮT (ver 1.3):
// - Sửa lỗi Home folder bị trống do lệch product.name
// - Chuyển curated list từ productNames -> productSlugs (ổn định hơn)
// - Title/desc giữ nguyên theo UI Apple folder
//
// CHỖ CẦN CHỈNH:
// - Muốn thay sản phẩm trong từng folder: sửa mảng productSlugs bên dưới.
//
// end goal: Home luôn map đúng sản phẩm miễn DB giữ slug ổn định

export const HOME_PRODUCT_FOLDERS = [
  {
    title: "Bộ dây đèn EDISON",
    desc: "Ánh vàng ấm, vibe cổ điển – lắp là xênh.",
    productSlugs: [
      "bo-day-den-edison",
      "bo-day-den-edison-1-toc",
      "bo-day-den-edison-2-toc",
    ],
  },
  {
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
    title: "Dây lẻ, Bóng lẻ",
    desc: "Phụ kiện thay thế & nâng cấp theo nhu cầu.",
    productSlugs: ["day-le", "bong-le"],
  },
] as const

// end code