/**
 * app/lien-he/page.tsx
 * Căn giữa tất cả + title vàng sáng.
 */

import FadeInSection from "@/components/FadeInSection"

export const metadata = {
  title: "Liên hệ | ĐÓM XÊNH",
  description: "Liên hệ tư vấn, đặt hàng và hỗ trợ bảo hành của ĐÓM XÊNH.",
}

const CONTACT = {
  phoneDisplay: "0352 595 444", // TODO: sửa
  phoneTel: "0352595444", // TODO: sửa (chỉ số)
  zaloUrl: "https://zalo.me/1150020274523938917", // TODO: sửa
  messengerUrl: "https://m.me/301095173088222", // TODO: sửa
  fanpageUrl: "https://www.facebook.com/dom.xenh/", // TODO: sửa
  tiktokUrl: "https://www.tiktok.com/@domxenh", // TODO: sửa
  shopeeUrl: "https://shopee.vn/dom.xenh", // TODO: sửa
  youtubeUrl: "https://www.youtube.com/@dom.xenh.88", // TODO: sửa
  addressLine: "Thái Bình, Việt Nam", // TODO: sửa
  mapUrl: "https://maps.app.goo.gl/pvDcTcH9FWwCDQaGA", // TODO: sửa
}

type IconName =
  | "phone"
  | "zalo"
  | "messenger"
  | "facebook"
  | "tiktok"
  | "shopee"
  | "youtube"
  | "location"

function Icon({ name }: { name: IconName }) {
  const common = "h-6 w-6 md:h-7 md:w-7"
  switch (name) {
    case "phone":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6.6 10.8c1.6 3.2 3.4 5 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4.2.6.7 0 1.3.6 1.3 1.3V21c0 .7-.6 1.3-1.3 1.3C9.5 22.3 1.7 14.5 1.7 5.3 1.7 4.6 2.3 4 3 4h3.8c.7 0 1.3.6 1.3 1.3 0 1.5.2 2.9.6 4.2.1.4 0 .9-.3 1.2L6.6 10.8z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "zalo":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2.5c5.2 0 9.5 3.6 9.5 8.1 0 4.2-3.6 7.7-8.3 8.1L7 21.5l1.6-3.6C5.2 16.7 2.5 13.9 2.5 10.6 2.5 6.1 6.8 2.5 12 2.5z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M8 13.5h6.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M8 10.2h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case "messenger":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3c5.2 0 9.5 3.9 9.5 8.8 0 4.9-4.3 8.8-9.5 8.8-1 0-2-.1-2.9-.4L6 22l.7-3.2C4.4 17.2 2.5 14.7 2.5 11.8 2.5 6.9 6.8 3 12 3z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 14.2l3.6-3.7 2.1 2 3.9-3.7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case "facebook":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 8.5V7c0-.8.6-1.5 1.5-1.5H17V3h-1.5C12.9 3 11 4.9 11 7v1.5H9V11h2v10h3V11h2.4l.6-2.5H14z"
            fill="currentColor"
          />
        </svg>
      )
    case "tiktok":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 3c.5 3.2 2.5 5.1 5.7 5.3V11c-1.9 0-3.5-.6-4.9-1.7v6.2c0 3-2.4 5.5-5.5 5.5S3.8 18.5 3.8 15.5 6.2 10 9.3 10c.3 0 .7 0 1 .1v2.9c-.3-.1-.6-.2-1-.2-1.4 0-2.6 1.2-2.6 2.7s1.1 2.7 2.6 2.7c1.7 0 2.8-1.1 2.8-3.3V3h1.9z"
            fill="currentColor"
          />
        </svg>
      )
    case "shopee":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 7V6a5 5 0 0 1 10 0v1h2a1 1 0 0 1 1 1l-1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1L4 8a1 1 0 0 1 1-1h2zm2 0h6V6a3 3 0 0 0-6 0v1z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 13.3c.7-.6 1.7-1 2.8-1 2 0 3.6 1.2 3.6 2.7 0 1.4-1.3 2.4-3 2.6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      )
    case "youtube":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 8.2a3 3 0 0 0-2.1-2.1C17.1 5.6 12 5.6 12 5.6s-5.1 0-6.9.5A3 3 0 0 0 3 8.2 31.5 31.5 0 0 0 3 12s0 2.2.5 3.8a3 3 0 0 0 2.1 2.1c1.8.5 6.9.5 6.9.5s5.1 0 6.9-.5a3 3 0 0 0 2.1-2.1c.5-1.6.5-3.8.5-3.8s0-2.2-.5-3.8z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M10 9.6l5 2.4-5 2.4V9.6z" fill="currentColor" />
        </svg>
      )
    case "location":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s7-6.1 7-12.1A7 7 0 0 0 5 8.9C5 14.9 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path d="M12 11.2a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )
  }
}

const YELLOW =
  "text-[#FFD66B] drop-shadow-[0_0_20px_rgba(255,214,107,0.55)]"

function TitleGold({ children }: { children: React.ReactNode }) {
  return <span className={`${YELLOW} font-extrabold`}>{children}</span>
}

function Highlight({ children }: { children: React.ReactNode }) {
  return <span className={`${YELLOW} font-semibold`}>{children}</span>
}

function ContactCard({
  icon,
  title,
  desc,
  href,
  cta,
}: {
  icon: IconName
  title: React.ReactNode
  desc: React.ReactNode
  href: string
  cta: string
}) {
  const isExternal = href.startsWith("http")
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="
        group rounded-3xl border border-[#FFD66B]/22 bg-black/25 backdrop-blur-xl
        p-6 md:p-7 transition
        shadow-[0_30px_110px_rgba(0,0,0,0.62)]
        hover:bg-black/30 hover:border-[#FFD66B]/32
        text-center
      "
    >
      <div className="flex flex-col items-center">
        <div
          className="
            rounded-2xl p-3 border border-[#FFD66B]/20
            bg-[#FFD66B]/10
            shadow-[0_0_30px_rgba(255,214,107,0.22)]
          "
        >
          <div className="text-[#FFD66B]">
            <Icon name={icon} />
          </div>
        </div>

        <div className="mt-4 text-lg leading-snug">{title}</div>
        <div className="mt-2 text-white/72 text-sm leading-relaxed max-w-[28rem]">
          {desc}
        </div>

        <div
          className="
            mt-5 inline-flex items-center justify-center rounded-full px-5 py-2.5
            text-sm font-semibold border border-[#FFD66B]/35
            bg-[#FFD66B]/18 text-white
            transition group-hover:bg-[#FFD66B]/24
            shadow-[0_0_24px_rgba(255,214,107,0.18)]
          "
        >
          {cta}
        </div>
      </div>
    </a>
  )
}

export default function LienHePage() {
  return (
    <main className="relative min-h-screen pt-36 pb-24 px-6 md:px-10">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/images/hero-outdoor.webp')] bg-cover bg-center opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-[#071014]/95" />
      </div>

      <div className="mx-auto max-w-5xl">
        <FadeInSection>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-white">
              <TitleGold>Liên hệ</TitleGold>
            </h1>

            <p className="mt-4 text-white/75 max-w-3xl mx-auto leading-relaxed">
              Chọn kênh bạn tiện nhất: <Highlight>gọi điện</Highlight>, nhắn{" "}
              <Highlight>Zalo/Messenger</Highlight>, hoặc theo dõi các{" "}
              <Highlight>kênh chính thức</Highlight> của Đóm Xênh.
            </p>
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactCard
              icon="phone"
              title={<TitleGold>Số điện thoại</TitleGold>}
              desc={
                <>
                  <Highlight>{CONTACT.phoneDisplay}</Highlight>
                </>
              }
              href={`tel:${CONTACT.phoneTel}`}
              cta="Gọi ngay"
            />

            <ContactCard
              icon="zalo"
              title={<TitleGold>Zalo</TitleGold>}
              desc={
                <>
                  <Highlight>Nhắn nhanh</Highlight> – tư vấn &{" "}
                  <Highlight>báo giá</Highlight>
                </>
              }
              href={CONTACT.zaloUrl}
              cta="Mở Zalo"
            />

            <ContactCard
              icon="messenger"
              title={<TitleGold>Messenger</TitleGold>}
              desc={
                <>
                  Hỗ trợ <Highlight>nhanh</Highlight> – gửi{" "}
                  <Highlight>hình & video</Highlight>
                </>
              }
              href={CONTACT.messengerUrl}
              cta="Mở Messenger"
            />

            <ContactCard
              icon="facebook"
              title={<TitleGold>Fanpage Facebook</TitleGold>}
              desc={
                <>
                  Cập nhật <Highlight>mẫu mới</Highlight> – chương trình{" "}
                  <Highlight>ưu đãi</Highlight>
                </>
              }
              href={CONTACT.fanpageUrl}
              cta="Xem Fanpage"
            />

            <ContactCard
              icon="tiktok"
              title={<TitleGold>TikTok</TitleGold>}
              desc={
                <>
                  Video <Highlight>thực tế</Highlight> – vibe & cách lắp{" "}
                  <Highlight>đẹp</Highlight>
                </>
              }
              href={CONTACT.tiktokUrl}
              cta="Xem TikTok"
            />

            <ContactCard
              icon="shopee"
              title={<TitleGold>Shopee</TitleGold>}
              desc={
                <>
                  <Highlight>Đặt nhanh</Highlight> – theo dõi đơn –{" "}
                  <Highlight>flash sale</Highlight>
                </>
              }
              href={CONTACT.shopeeUrl}
              cta="Mở Shopee"
            />

            <ContactCard
              icon="youtube"
              title={<TitleGold>YouTube</TitleGold>}
              desc={
                <>
                  Hướng dẫn <Highlight>lắp đặt</Highlight> – review{" "}
                  <Highlight>thực tế</Highlight>
                </>
              }
              href={CONTACT.youtubeUrl}
              cta="Xem YouTube"
            />

            <ContactCard
              icon="location"
              title={<TitleGold>Địa chỉ</TitleGold>}
              desc={
                <>
                  <Highlight>{CONTACT.addressLine}</Highlight>
                </>
              }
              href={CONTACT.mapUrl}
              cta="Mở Google Maps"
            />
          </div>
        </FadeInSection>

        <FadeInSection>
          <div className="mt-8 rounded-3xl border border-[#FFD66B]/18 bg-black/25 backdrop-blur-xl p-6 text-center shadow-[0_30px_110px_rgba(0,0,0,0.62)]">
            <div className={`${YELLOW} font-semibold`}>Tip nhỏ</div>
            <p className="mt-2 text-white/75 leading-relaxed max-w-3xl mx-auto">
              Nếu bạn cần <Highlight>bảo hành</Highlight>, hãy chuẩn bị:{" "}
              <Highlight>mã đơn</Highlight>, <Highlight>SKU</Highlight>,{" "}
              <Highlight>ảnh/video lỗi</Highlight> (nếu có) để xử lý nhanh nhất.
            </p>
          </div>
        </FadeInSection>
      </div>
    </main>
  )
}