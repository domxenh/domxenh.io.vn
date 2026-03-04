// app/checkout/page.tsx
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

// Giữ /checkout để không lỗi link cũ, nhưng chuyển về route chuẩn tiếng Việt.
export default function CheckoutRedirectPage() {
  redirect("/thanh-toan")
}