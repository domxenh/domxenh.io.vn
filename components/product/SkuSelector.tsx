"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

export type EdisonSku = {
  label: string
  skuCode: string
  sku?: string
  image: string
  price: number
  oldPrice: number | null
}

type NormalizedSku = {
  label: string
  skuCode: string
  image: string
  price: number
  oldPrice: number | null
}

type SpecsBlock =
  | { heading: string; bullets: string[] }
  | { heading: string; text: string[] }

type SpecsContent = {
  title: string
  blocks: SpecsBlock[]
}

function slugToName(slug: string) {
  if (slug === "bo-day-den-edison") return "Bộ dây đèn Edison"
  if (slug === "bo-day-den-edison-1-toc") return "Bộ dây đèn Edison 1 tóc"
  if (slug === "bo-day-den-edison-2-toc") return "Bộ dây đèn Edison 2 tóc"
  if (slug === "bo-day-den-bong-tron-3w") return "Đèn LED Ngoài Trời bóng tròn 3W"
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function getSpecsContent(slug: string): SpecsContent {
  if (slug === "bo-day-den-edison") {
    return {
      title: "Bộ dây đèn Edison",
      blocks: [
        {
          heading: "Vì sao nên chốt ngay?",
          text: [
            "Ngoài trời mà bóng thường vài tháng là hỏng? Nước vào, vỡ bóng, chập điện – mất tiền thay liên tục.",
            "Lô hiện tại đang ưu đãi – lô sau nhập về thường tăng theo linh kiện.",
            "Chốt ngay dây đèn chống nước, chống vỡ – giữ giá tốt hôm nay.",
          ],
        },
        {
          heading: "Lợi ích thực tế – không chỉ là bóng đèn",
          bullets: [
            "Chống nước IP65: Treo ngoài trời mưa gió vẫn ổn định.",
            "Chống vỡ (vỏ nhựa/acrylic): Hạn chế thay bóng, tiết kiệm chi phí.",
            "Công suất 3W/bóng: Tiết kiệm điện dài hạn.",
            "Ánh sáng vàng ấm (warm): Không gian chill, chụp hình đẹp.",
            "Đui E27 phổ thông: Thay bóng dễ, linh hoạt đổi loại bóng.",
            "Dây lõi đồng/đui chắc chắn: Bền bỉ, hạn chế oxy hóa.",
          ],
        },
        {
          heading: "Thông số kỹ thuật",
          bullets: ["Chuẩn chống nước: IP65", "Công suất: ~3W/bóng", "Đui: E27", "Điện áp: 220V", "Bóng: nhựa/acrylic chống vỡ"],
        },
        {
          heading: "Gợi ý lắp cho đẹp (vibe cổ điển)",
          text: [
            "Treo theo đường viền trần/khung giàn, chia khoảng đều để ánh sáng mềm.",
            "Dùng móc/kẹp để dây thẳng và gọn.",
            "Không gian lớn: chọn combo dài + nhiều bóng để sáng đều.",
          ],
        },
        {
          heading: "Bảo hành & lưu ý",
          text: [
            "Bảo hành theo chính sách cửa hàng.",
            "Không kéo căng dây quá mức; tránh bẻ gập mạnh tại đầu nối.",
            "Vệ sinh bằng khăn khô/ẩm nhẹ; hạn chế hóa chất mạnh.",
          ],
        },
      ],
    }
  }

  if (slug === "bo-day-den-edison-1-toc") {
    return {
      title: "Bộ dây đèn Edison 1 tóc",
      blocks: [
        {
          heading: "THÔNG SỐ NỔI BẬT",
          bullets: [
            "Bóng nhựa Acrylic chống vỡ (nhẹ, bền, chịu va đập).",
            "Đui xoáy chuẩn E27 (dễ thay thế bóng).",
            "Công suất 3W tiết kiệm điện, ánh sáng ấm (warm).",
            "Dây đồng đúc nguyên khối – bền bỉ, chống oxi hóa.",
            "Chống mưa nắng chuẩn IP65 – lắp ngoài trời yên tâm.",
            "Có đầu nối để nối dài linh hoạt.",
          ],
        },
        {
          heading: "Ưu điểm “Chill & Decor”",
          bullets: ["Quán cafe – nhà hàng – sân vườn", "Tiệc cưới/sinh nhật/lễ hội ngoài trời", "Ban công, sân nhà, BBQ", "Tạo bầu không khí ấm áp, sang trọng"],
        },
      ],
    }
  }

  if (slug === "bo-day-den-edison-2-toc") {
    return {
      title: "Bộ dây đèn Edison 2 tóc",
      blocks: [
        {
          heading: "THÔNG SỐ NỔI BẬT",
          bullets: [
            "Ánh sáng vàng nổi bật (2 tóc).",
            "Bóng nhựa Acrylic chống vỡ – siêu bền.",
            "Đui xoáy chuẩn E27 – dễ thay bóng.",
            "Chống mưa nắng IP65 – phù hợp ngoài trời.",
            "Có đầu nối để nối dài linh hoạt.",
          ],
        },
        {
          heading: "Ưu điểm “Chill & Decor”",
          bullets: ["Quán cafe – nhà hàng – sân vườn", "Tiệc ngoài trời, BBQ", "Ban công, sân nhà", "Không gian cần vibe ấm áp/sang trọng"],
        },
      ],
    }
  }

  if (slug === "bo-day-den-bong-tron-3w") {
    return {
      title: "Đèn LED Ngoài Trời bóng tròn 3W",
      blocks: [
        {
          heading: "Đặc điểm nổi bật",
          bullets: [
            "Đui xoáy E27 dễ thay bóng mới",
            "Công suất 3W",
            "Đổi màu vỏ: Trắng, vàng…",
            "Vỏ nhựa/acrylic siêu bền, có thể thay mới",
            "Cáp cao su/PU hạng nặng, chịu nhiệt, an toàn ngoài trời",
          ],
        },
        {
          heading: "Thông số kỹ thuật",
          bullets: ["Kiểu bóng: Ø46 × cao 86–90 mm", "Điện áp: 220–240V AC", "Quang thông: 80–180 lm", "Tuổi thọ: 15.000–25.000 giờ", "Chống nước: IP65"],
        },
        {
          heading: "Ứng dụng",
          bullets: ["Decor quán café, ban công", "Tiệc sân vườn/BBQ", "Không gian chill, sang trọng"],
        },
      ],
    }
  }

  return {
    title: slugToName(slug),
    blocks: [
      {
        heading: "Thông số sản phẩm",
        text: ["Hiện chưa có dữ liệu thông số cho sản phẩm này. Bạn gửi nội dung thông số, mình sẽ thêm vào đúng chuẩn."],
      },
    ],
  }
}

export default function SkuSelector(props: {
  defaultImage: string
  skus: EdisonSku[]
  slug: string
  title?: string
  compact?: boolean
  maxHeightVh?: number

  // ✅ compat: các nơi khác còn truyền, giữ để không lỗi TS
  resetText?: string
  hideTopActions?: boolean
}) {
  const { skus, slug, title = "Chọn độ dài dây", compact = false, maxHeightVh } = props

  const [activeCode, setActiveCode] = useState("")
  const [focusCode, setFocusCode] = useState("")
  const [showSpecs, setShowSpecs] = useState(false)

  const normalized: NormalizedSku[] = useMemo(() => {
    return (skus || [])
      .map((s) => ({
        label: (s.label || "").trim(),
        skuCode: (s.skuCode || s.sku || "").trim(),
        image: s.image,
        price: s.price,
        oldPrice: s.oldPrice ?? null,
      }))
      .filter((s) => s.skuCode && s.label)
  }, [skus])

  const byCode = useMemo(() => {
    const m = new Map<string, NormalizedSku>()
    for (const s of normalized) m.set(s.skuCode, s)
    return m
  }, [normalized])

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const selectSkuByCode = useCallback(
    (skuCode: string) => {
      if (skuCode === activeCode) return
      setFocusCode("")
      setActiveCode(skuCode)

      const found = byCode.get(skuCode)
      if (!found) return

      window.dispatchEvent(
        new CustomEvent("sku:change", {
          detail: {
            productSlug: slug,
            skuCode: found.skuCode,
            label: found.label,
            image: found.image,
            price: found.price,
            oldPrice: found.oldPrice,
          },
        })
      )

      window.dispatchEvent(
        new CustomEvent("edison-sku-change", {
          detail: {
            price: found.price,
            oldPrice: found.oldPrice ?? null,
            sku: found.skuCode,
            label: found.label,
            image: found.image,
          },
        })
      )

      window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: found.image } }))
    },
    [activeCode, byCode, slug]
  )

  // mở popup specs từ event (nếu nơi khác bắn)
  useEffect(() => {
    const openSpecs = () => setShowSpecs(true)
    window.addEventListener("sku:open-specs", openSpecs as any)
    return () => window.removeEventListener("sku:open-specs", openSpecs as any)
  }, [])

  const wrapClass = compact
    ? "mt-1 rounded-2xl border border-white/10 bg-white/5 p-3"
    : "mt-2 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"

  const headerTitleClass =
    "text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.85)] font-semibold text-[15px] sm:text-base"

  const specsBtnClass =
    "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] sm:text-sm font-semibold " +
    "text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.9)] " +
    "border border-[#FFD66B]/22 bg-black/25 hover:brightness-110 transition"

  const listStyle = maxHeightVh ? ({ maxHeight: `${maxHeightVh}vh` } as const) : undefined
  const specs = useMemo(() => getSpecsContent(slug), [slug])

  return (
    <>
      <div className={wrapClass}>
        <div className="flex items-center justify-between gap-3">
          <div className={headerTitleClass}>{title}</div>
          <button type="button" onClick={() => setShowSpecs(true)} className={specsBtnClass}>
            Thông số sản phẩm
          </button>
        </div>

        <div
          className={[
            "mt-3 grid gap-2.5",
            "grid-cols-2 items-stretch auto-rows-fr",
            maxHeightVh ? "overflow-auto pr-1" : "",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          ].join(" ")}
          style={listStyle}
        >
          {normalized.map((s) => {
            const selected = s.skuCode === activeCode
            const focused = s.skuCode === focusCode

            const borderClass = selected
              ? "border-[#FFD66B] shadow-[0_0_0_1px_rgba(255,214,107,0.25),0_0_22px_rgba(255,214,107,0.18)]"
              : focused
              ? "border-[#FFD66B] shadow-[0_0_0_1px_rgba(255,214,107,0.20),0_0_18px_rgba(255,214,107,0.14)]"
              : "border-white/25 hover:border-[#FFD66B]/60"

            const labelClass = selected || focused ? "text-[#FFD66B]" : "text-white"

            return (
              <button
                key={s.skuCode}
                ref={(el) => {
                  itemRefs.current[s.skuCode] = el
                }}
                type="button"
                onClick={() => selectSkuByCode(s.skuCode)}
                className={[
                  "text-left rounded-xl border transition bg-black/20",
                  "px-2.5 py-2 min-h-[52px] text-[13px]",
                  "sm:px-3 sm:py-2.5 sm:min-h-[60px] sm:text-sm",
                  "h-full flex flex-col justify-center",
                  borderClass,
                ].join(" ")}
              >
                <div className={["font-semibold leading-snug", labelClass].join(" ")}>{s.label}</div>
              </button>
            )
          })}
        </div>
      </div>

      {showSpecs ? (
        <div className="fixed inset-0 z-[130]">
          <button className="absolute inset-0 bg-black/60" aria-label="Đóng" onClick={() => setShowSpecs(false)} />

          <div className="absolute left-1/2 top-[52%] md:top-[42%] w-[92vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0B1417]/95 md:backdrop-blur-md shadow-[0_40px_140px_rgba(0,0,0,0.85)] overflow-hidden">
            <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between gap-3">
              <div>
                <div className="text-white/60 text-sm">Thông số sản phẩm</div>
                <div className="text-[#FFD66B] text-xl md:text-2xl font-extrabold drop-shadow-[0_0_22px_rgba(255,214,107,0.55)]">
                  {specs.title}
                </div>
              </div>
              <button
                className="rounded-full px-3 py-2 border border-white/12 bg-white/5 text-white/85 hover:bg-white/10 transition"
                onClick={() => setShowSpecs(false)}
              >
                Đóng
              </button>
            </div>

            <div className="max-h-[58vh] md:max-h-[52vh] overflow-auto p-5 md:p-6">
              {specs.blocks.map((b, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <div className="text-white font-bold mb-2">{b.heading}</div>

                  {"bullets" in b ? (
                    <ul className="list-disc pl-5 space-y-2 text-white/85">
                      {b.bullets.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : null}

                  {"text" in b ? (
                    <div className="space-y-2 text-white/85">
                      {b.text.map((t, i) => (
                        <p key={i}>{t}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="p-4 md:p-5 border-t border-white/10 flex items-center justify-end">
              <button
                className="rounded-full px-4 py-2.5 bg-[#FFD66B] text-black font-bold shadow-[0_14px_40px_rgba(255,214,107,0.22)] hover:brightness-105 transition"
                onClick={() => setShowSpecs(false)}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}