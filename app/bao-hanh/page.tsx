/**
 * app/bao-hanh/page.tsx
 *
 * Trang Bảo Hành (bản chuẩn nội dung + thiết kế gọn, dễ đọc).
 */

import Link from "next/link"
import FadeInSection from "@/components/FadeInSection"

export const metadata = {
  title: "Bảo Hành | ĐÓM XÊNH",
  description: "Chính sách bảo hành – đổi trả của ĐÓM XÊNH.",
}

export default function BaoHanhPage() {
  return (
    <main className="min-h-screen pt-36 pb-24 px-6 md:px-10">
      <div className="mx-auto max-w-5xl">
        <FadeInSection>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Link href="/" className="hover:text-white">
                Trang chủ
              </Link>
              <span className="text-white/35">/</span>
              <span className="text-[#FFD66B] drop-shadow-[0_0_14px_rgba(255,214,107,0.35)]">Bảo hành</span>
            </div>
            
          <div className="text-center">
            <h1 className="mt-4 text-4xl md:text-5xl font-semibold text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.55)]">
              Chính sách bảo hành
            </h1>

            <p className="mt-3 text-white/75 leading-relaxed max-w-3xl mx-auto">
              Đóm Xênh ưu tiên hỗ trợ nhanh – rõ ràng – minh bạch để bạn yên tâm sử dụng sản phẩm ngoài trời lâu dài.
            </p>
          </div>
        </FadeInSection>

        {/* Highlight */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FadeInSection>
            <div className="rounded-3xl border border-[#FFD66B]/20 bg-black/35 backdrop-blur-xl p-6 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
              <div className="text-white/60 text-sm">Cam kết bảo hành</div>
              <div className="mt-2 text-[#FFD66B] text-2xl md:text-3xl font-extrabold drop-shadow-[0_0_24px_rgba(255,214,107,0.55)]">
                Dây đèn: 1 đổi 1 trong 1 năm
              </div>
              <p className="mt-3 text-white/75 leading-relaxed">
                Áp dụng với lỗi kỹ thuật do nhà sản xuất (đúng điều kiện bảo hành).
              </p>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="rounded-3xl border border-[#FFD66B]/20 bg-black/35 backdrop-blur-xl p-6 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
              <div className="text-white/60 text-sm">Cam kết bảo hành</div>
              <div className="mt-2 text-[#FFD66B] text-2xl md:text-3xl font-extrabold drop-shadow-[0_0_24px_rgba(255,214,107,0.55)]">
                Bóng đèn: 1 tháng đầu
              </div>
              <p className="mt-3 text-white/75 leading-relaxed">
                Hỗ trợ đổi/bảo hành bóng trong 30 ngày đầu nếu phát sinh lỗi kỹ thuật.
              </p>
            </div>
          </FadeInSection>
        </div>

        {/* Content cards */}
        <div className="mt-10 space-y-6">
          <FadeInSection>
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-8">
              <h2 className="text-[#FFD66B] text-xl md:text-2xl font-bold drop-shadow-[0_0_18px_rgba(255,214,107,0.35)]">
                I. QUY ĐỊNH VỀ VIỆC BẢO HÀNH
              </h2>

              <div className="mt-6 space-y-6">
                {/* 1. khái niệm */}
                <div>
                  <h3 className="text-[#FFD66B] font-semibold text-lg">1) Một số khái niệm</h3>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-white font-semibold">Bảo hành sửa chữa</div>
                      <div className="mt-2 text-white/75 text-sm leading-relaxed">
                        Khắc phục các sự cố, hỏng hóc do lỗi của nhà sản xuất.
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-white font-semibold">Bảo hành đổi mới</div>
                      <div className="mt-2 text-white/75 text-sm leading-relaxed">
                        Đổi mới toàn bộ hoặc một phần sản phẩm bị hỏng sang sản phẩm mới (toàn bộ hoặc một phần).
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                      <div className="text-white font-semibold">Bảo hành tại nhà</div>
                      <div className="mt-2 text-white/75 text-sm leading-relaxed">
                        Nhân viên Đóm Xênh đến tại nơi có sử dụng sản phẩm để thực hiện bảo hành.
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. được bảo hành */}
                <div>
                  <h3 className="text-[#FFD66B] font-semibold text-lg">2) Trường hợp được bảo hành</h3>
                  <ul className="mt-3 space-y-2 text-white/75 list-disc pl-5 leading-relaxed">
                    <li>Sản phẩm hỏng hóc do lỗi kỹ thuật của bản thân sản phẩm.</li>
                    <li>Sản phẩm được bảo hành miễn phí nếu còn trong thời hạn bảo hành.</li>
                    <li>
                      Có phiếu bảo hành và tem bảo hành của hãng sản xuất Đóm Xênh hoặc nhà phân phối trên sản phẩm.
                    </li>
                  </ul>
                </div>

                {/* 3. không được bảo hành */}
                <div>
                  <h3 className="text-[#FFD66B] font-semibold text-lg">3) Những trường hợp không được bảo hành</h3>
                  <ul className="mt-3 space-y-2 text-white/75 list-disc pl-5 leading-relaxed">
                    <li>
                      Hết thời hạn bảo hành; tem bảo hành bị rách/dán đè; mất phiếu bảo hành hoặc tem bị sửa đổi.
                    </li>
                    <li>Sản phẩm hỏng do va đập, rơi vỡ, thiên tai, hỏa hoạn.</li>
                    <li>
                      Hỏng do lỗi sử dụng: dùng sai điện áp quy định, đấu nối sai quy cách, dây LED cắt không đúng vị trí,
                      dùng không đúng môi trường chỉ định.
                    </li>
                    <li>Sản phẩm bị tự ý tháo ra do cá nhân/kỹ thuật viên không phải của Đóm Xênh.</li>
                  </ul>
                </div>
              </div>
            </section>
          </FadeInSection>

          <FadeInSection>
            <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 md:p-8">
              <h2 className="text-[#FFD66B] text-xl md:text-2xl font-bold drop-shadow-[0_0_18px_rgba(255,214,107,0.35)]">
                II. ĐỊA ĐIỂM BẢO HÀNH
              </h2>

              <div className="mt-5 rounded-2xl border border-[#FFD66B]/18 bg-black/25 p-5">
                <p className="text-white/80 leading-relaxed">
                  <span className="text-white font-semibold">Khách hàng ngoài khu vực Thái Bình:</span> có thể gửi sản
                  phẩm về địa chỉ của Đóm Xênh (khi gửi cần liên hệ trước với nhân viên).
                </p>
                <p className="mt-3 text-white/80 leading-relaxed">
                  <span className="text-white font-semibold">Hỗ trợ phí vận chuyển:</span> Đóm Xênh sẽ chịu{" "}
                  <span className="text-[#FFD66B] font-semibold">50%</span> chi phí vận chuyển (theo thoả thuận khi xác
                  nhận bảo hành).
                </p>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
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