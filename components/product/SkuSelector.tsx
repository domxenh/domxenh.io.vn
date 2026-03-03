"use client"

/**
 * TÓM TẮT (VN):
 * - PC: Kéo box modal "Thông số sản phẩm" lên cao hơn một chút để không bị StickyBuyBar / nút Đặt hàng che.
 * - Không đổi logic/modal/sku, chỉ đổi vị trí top của modal container (nhẹ, load nhanh).
 *
 * NƠI CHỈNH:
 * - Modal Thông Số: đổi class top-1/2 -> top-[46%] md:top-[44%]
 */

import { useCallback, useMemo, useRef, useState } from "react"

export type EdisonSku = {
  label: string
  skuCode: string
  sku?: string
  image: string
  price: number
  oldPrice: number | null
}

type SkuChangeDetail = {
  productSlug: string
  skuCode: string
  label: string
  image: string
  price: number
  oldPrice: number | null
}

type EdisonChangeDetail = {
  price: number
  oldPrice: number | null
  sku: string
  label: string
  image?: string
}

type NormalizedSku = {
  label: string
  skuCode: string
  image: string
  price: number
  oldPrice: number | null
}

function slugToName(slug: string) {
  if (slug === "bo-day-den-edison") return "Bộ dây đèn Edison"
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function getSpecsContent(slug: string) {
  if (slug === "bo-day-den-edison") {
    return {
      title: "Bộ dây đèn Edison",
      blocks: [
        {
          heading: "Vì sao nên chốt ngay?",
          text: [
            "Ngoài trời mà bóng thường vài tháng là hỏng? Nước vào, vỡ bóng, chập điện – mất tiền thay liên tục.",
            "Giá lô hiện tại đang ưu đãi – lô sau nhập về tăng giá theo linh kiện.",
            "Chốt ngay Đèn LED EDISON IP65 chống nước, chống vỡ – giữ giá tốt hôm nay.",
          ],
        },
        {
          heading: "Lợi ích thực tế – không chỉ là bóng đèn",
          bullets: [
            "Chống nước IP65: Treo ngoài trời mưa gió vẫn ổn định, không lo chập cháy.",
            "Chống vỡ (vỏ nhựa/acrylic): Hạn chế thay bóng liên tục, tiết kiệm chi phí vận hành.",
            "Công suất 3W siêu tiết kiệm: Giảm tiền điện dài hạn cho quán, homestay.",
            "Ánh sáng vàng 2200K vàng nắng: Tạo không gian ấm áp, khách ngồi lâu hơn, chụp hình đẹp hơn.",
            "Đui E27 phổ thông: Thay thế cực dễ, không cần chỉnh sửa hệ thống.",
            "Đui đúc nguyên khối + lõi đồng: Bền bỉ theo năm tháng, không oxy hóa.",
            "Chụp bóng LED tản nhiệt tốt: Hạn chế nóng, tăng tuổi thọ bóng.",
          ],
        },
        {
          heading: "Thông số kỹ thuật",
          bullets: [
            "Chuẩn chống nước: IP65",
            "Công suất: 3W/bóng",
            "Nhiệt màu: 2200K (vàng ấm)",
            "Đui: E27",
            "Vật liệu bóng: nhựa/acrylic chống vỡ",
            "Điện áp: 220V",
          ],
        },
        {
          heading: "Gợi ý lắp cho đẹp (vibe cổ điển)",
          text: [
            "Treo dây theo đường viền trần/khung giàn, chia khoảng đều để ánh sáng tỏa mềm.",
            "Dùng thêm móc treo/đinh kẹp để dây luôn thẳng và gọn.",
            "Nếu không gian lớn: chọn combo dài + nhiều bóng để ánh sáng đều, không bị tối góc.",
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

export default function SkuSelector({
  defaultImage,
  skus,
  slug,
  title = "Chọn độ dài dây",
  resetText = "Xem ảnh sản phẩm",
  compact = false,
  maxHeightVh,
}: {
  defaultImage: string
  skus: EdisonSku[]
  slug: string
  title?: string
  resetText?: string
  compact?: boolean
  maxHeightVh?: number
}) {
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

  const sku5m10 = useMemo(() => {
    return (
      byCode.get("edison 5m10") ||
      normalized.find((s) => {
        const t = s.label.toLowerCase()
        return t.includes("5 mét") && t.includes("10 bóng")
      }) ||
      null
    )
  }, [byCode, normalized])

  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const emitAll = useCallback((detail: SkuChangeDetail) => {
    window.dispatchEvent(new CustomEvent("sku:change", { detail }))

    const ed: EdisonChangeDetail = {
      price: detail.price,
      oldPrice: detail.oldPrice ?? null,
      sku: detail.skuCode,
      label: detail.label,
      image: detail.image,
    }

    window.dispatchEvent(new CustomEvent("edison-sku-change", { detail: ed }))
    window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: detail.image } }))
  }, [])

  const selectSkuByCode = useCallback(
    (skuCode: string) => {
      if (skuCode === activeCode) return
      setFocusCode("")
      setActiveCode(skuCode)

      const found = byCode.get(skuCode)
      if (!found) return

      emitAll({
        productSlug: slug,
        skuCode: found.skuCode,
        label: found.label,
        image: found.image,
        price: found.price,
        oldPrice: found.oldPrice,
      })
    },
    [activeCode, byCode, emitAll, slug]
  )

  const onViewProductImage = useCallback(() => {
    if (activeCode) setActiveCode("")
    setFocusCode("")

    const productThumb1 = slug === "bo-day-den-edison" ? "/images/edison/thumb/edison/1.webp" : ""
    const img = productThumb1 || defaultImage

    window.dispatchEvent(new CustomEvent("edison-image-change", { detail: { image: img } }))

    if (!sku5m10) return
    setFocusCode(sku5m10.skuCode)

    requestAnimationFrame(() => {
      const el = itemRefs.current[sku5m10.skuCode]
      if (el) {
        el.scrollIntoView({ block: "nearest", behavior: "smooth" })
        el.focus()
      }
    })

    window.dispatchEvent(
      new CustomEvent("edison-sku-change", {
        detail: {
          price: sku5m10.price,
          oldPrice: sku5m10.oldPrice ?? null,
          sku: sku5m10.skuCode,
          label: sku5m10.label,
          image: img,
        } as EdisonChangeDetail,
      })
    )
  }, [activeCode, defaultImage, sku5m10, slug])

  const wrapClass = compact
    ? "mt-3 rounded-2xl border border-white/10 bg-white/5 p-3"
    : "mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"

  const titleClass =
    "font-semibold text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.85)] text-center"

  const actionBtnClass =
    "whitespace-nowrap text-[12px] sm:text-sm font-semibold text-[#FFD66B] drop-shadow-[0_0_18px_rgba(255,214,107,0.9)] hover:brightness-110 transition border border-[#FFD66B]/20 bg-black/20 rounded-full px-3 sm:px-3.5 py-1.5"

  const listStyle = maxHeightVh ? ({ maxHeight: `${maxHeightVh}vh` } as const) : undefined
  const specs = useMemo(() => getSpecsContent(slug), [slug])

  return (
    <>
      <div className={wrapClass}>
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={() => setShowSpecs(true)} className={actionBtnClass}>
            Thông Số
          </button>
          <button type="button" onClick={onViewProductImage} className={actionBtnClass}>
            {resetText}
          </button>
        </div>

        <div className={["mt-2", titleClass].join(" ")}>{title}</div>

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
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Đóng"
            onClick={() => setShowSpecs(false)}
          />

          {/* ✅ CHỈNH: KÉO MODAL LÊN TRÊN 1 TÍ Ở PC để tránh bị sticky bar che */}
          <div className="absolute left-1/2 top-[46%] md:top-[44%] w-[92vw] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0B1417]/95 md:backdrop-blur-md shadow-[0_40px_140px_rgba(0,0,0,0.85)] overflow-hidden">
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

                  {Array.isArray((b as any).bullets) ? (
                    <ul className="list-disc pl-5 space-y-2 text-white/85">
                      {(b as any).bullets.map((t: string, i: number) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  ) : null}

                  {Array.isArray((b as any).text) ? (
                    <div className="space-y-2 text-white/85">
                      {(b as any).text.map((t: string, i: number) => (
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

// end code