/**
 * app/lien-he/page.tsx
 *
 * Trang Liên Hệ (khung form UI – chưa submit).
 * Nếu bạn muốn gửi form về email/Supabase, mình sẽ nối API route.
 */

import FadeInSection from "@/components/FadeInSection"

export const metadata = {
  title: "Liên hệ | ĐÓM XÊNH",
  description: "Liên hệ tư vấn, đặt hàng và hỗ trợ bảo hành của ĐÓM XÊNH.",
}

export default function LienHePage() {
  return (
    <main className="min-h-screen pt-36 pb-24 px-6 md:px-10">
      <div className="mx-auto max-w-4xl">
        <FadeInSection>
          <h1 className="text-4xl md:text-5xl font-semibold text-white drop-shadow-[0_0_18px_rgba(255,214,107,0.55)]">
            Liên hệ
          </h1>
          <p className="mt-4 text-white/75">
            Gửi thông tin để ĐÓM XÊNH tư vấn. (Trang này là UI khung, chưa gửi dữ liệu.)
          </p>
        </FadeInSection>

        <FadeInSection>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-7 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-white/80 text-sm">Họ tên</label>
                <input
                  className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none
                    focus:border-[#FFD66B]/40 focus:ring-2 focus:ring-[#FFD66B]/15 transition"
                  placeholder="Ví dụ: Nguyễn Văn A"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white/80 text-sm">Số điện thoại</label>
                <input
                  className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none
                    focus:border-[#FFD66B]/40 focus:ring-2 focus:ring-[#FFD66B]/15 transition"
                  placeholder="Ví dụ: 09xx..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-white/80 text-sm">Nội dung</label>
                <textarea
                  rows={5}
                  className="w-full rounded-2xl bg-black/30 border border-white/10 px-4 py-3 text-white outline-none
                    focus:border-[#FFD66B]/40 focus:ring-2 focus:ring-[#FFD66B]/15 transition"
                  placeholder="Bạn cần tư vấn sản phẩm, lắp đặt hay bảo hành?"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full px-6 py-3 bg-[#FFD66B]/18 border border-[#FFD66B]/35 text-white font-semibold
                    hover:bg-[#FFD66B]/24 transition shadow-[0_0_28px_rgba(255,214,107,0.25)]"
                >
                  Gửi liên hệ
                </button>

                <button
                  type="button"
                  className="rounded-full px-6 py-3 bg-white/10 border border-white/15 text-white font-semibold
                    hover:bg-white/15 transition"
                >
                  Zalo / Messenger (sắp thêm)
                </button>
              </div>
            </form>
          </div>
        </FadeInSection>
      </div>
    </main>
  )
}

// end code