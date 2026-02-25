/**
 * app/bao-hanh/page.tsx
 *
 * Trang Bảo Hành (nội dung cơ bản + đúng theme).
 */

import Link from "next/link"
import FadeInSection from "@/components/FadeInSection"

export const metadata = {
  title: "Bảo Hành | ĐÓM XÊNH",
  description: "Chính sách bảo hành và đổi trả của ĐÓM XÊNH.",
}

export default function BaoHanhPage() {
  return (
    <main className="min-h-screen pt-36 pb-24 px-6 md:px-10">
      <div className="mx-auto max-w-4xl">
        <FadeInSection>
          <h1 className="text-4xl md:text-5xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.55)]">
            Bảo Hành
          </h1>
          <p className="mt-4 text-white/75">
            Trang này là bản khung để bạn điền chính sách chi tiết. Nếu bạn gửi nội dung bảo hành,
            mình sẽ format lại theo style Apple-like (cards + highlight).
          </p>
        </FadeInSection>

        <div className="mt-10 space-y-6">
          <FadeInSection>
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">
              <h2 className="text-white text-xl font-semibold">1) Phạm vi bảo hành</h2>
              <ul className="mt-3 space-y-2 text-white/75 list-disc pl-5">
                <li>Lỗi kỹ thuật từ nhà sản xuất (dây, socket, kết nối).</li>
                <li>Lỗi bóng/nguồn (nếu mua kèm theo bộ).</li>
                <li>Không áp dụng với hư hỏng do tác động vật lý/ẩm ướt sai cách.</li>
              </ul>
            </section>
          </FadeInSection>

          <FadeInSection>
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">
              <h2 className="text-white text-xl font-semibold">2) Quy trình yêu cầu bảo hành</h2>
              <ol className="mt-3 space-y-2 text-white/75 list-decimal pl-5">
                <li>Chuẩn bị video/ảnh mô tả lỗi.</li>
                <li>Gửi thông tin đơn hàng + mô tả lỗi.</li>
                <li>ĐÓM XÊNH phản hồi hướng xử lý (đổi/repair/tư vấn).</li>
              </ol>
            </section>
          </FadeInSection>

          <FadeInSection>
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7">
              <h2 className="text-white text-xl font-semibold">3) Thời gian xử lý</h2>
              <p className="mt-3 text-white/75">
                Thời gian xử lý tuỳ tình trạng và khu vực giao nhận. Bạn có thể liên hệ để được hỗ trợ nhanh nhất.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/lien-he"
                  className="rounded-full px-5 py-2.5 bg-[#FFD66B]/15 border border-[#FFD66B]/30 text-white
                    hover:bg-[#FFD66B]/20 transition shadow-[0_0_22px_rgba(255,214,107,0.22)]"
                >
                  Liên hệ bảo hành
                </Link>
                <Link
                  href="/san-pham-full"
                  className="rounded-full px-5 py-2.5 bg-white/10 border border-white/15 text-white
                    hover:bg-white/15 transition"
                >
                  Xem sản phẩm
                </Link>
              </div>
            </section>
          </FadeInSection>
        </div>
      </div>
    </main>
  )
}

// end code