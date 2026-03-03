// components/VietQR.tsx
"use client"

/**
 * TÓM TẮT (VN):
 * - Nút "Quay lại" đặt cùng hàng với "Số tiền (VND)" ở góc phải.
 * - "Nội dung chuyển tiền" mặc định = mã đơn hàng (orderId) dùng chung cho:
 *   + Chuyển khoản
 *   + Đặt cọc
 *
 * NƠI CHỈNH:
 * - Props thêm onBack
 * - Label đổi flex justify-between
 * - memoFinal = memo || orderId
 */

import { useEffect, useMemo, useState } from "react"

const BANK_BIN = "970422"
const ACCOUNT_NO = "19089599999999"
const ACCOUNT_NAME = "Hoàng Minh Quang"
const TEMPLATE = "compact2"
const DEFAULT_MEMO = ""

function getOrCreateOrderId(): string {
  const k = "domxenh_orderid_v1"
  try {
    const old = localStorage.getItem(k)
    if (old && old.trim()) return old.trim()
    const id =
      (crypto?.randomUUID?.() ||
        `oid_${Date.now()}_${Math.random().toString(16).slice(2)}`) as string
    localStorage.setItem(k, id)
    return id
  } catch {
    return `oid_${Date.now()}_${Math.random().toString(16).slice(2)}`
  }
}

function buildVietQrImgUrl(amount: number, memo: string) {
  const addInfo = encodeURIComponent(memo)
  const accountName = encodeURIComponent(ACCOUNT_NAME)
  return `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`
}

type Props = {
  initialAmount?: number
  memo?: string
  autoFocus?: boolean
  onBack?: () => void
}

export default function VietQR({ initialAmount = 0, memo = DEFAULT_MEMO, autoFocus, onBack }: Props) {
  const [amountInput, setAmountInput] = useState<string>("")
  const [orderIdMemo, setOrderIdMemo] = useState<string>("")

  useEffect(() => {
    if (initialAmount > 0) setAmountInput(String(Math.round(initialAmount)))
    else setAmountInput("")
  }, [initialAmount])

  useEffect(() => {
    setOrderIdMemo((prev) => prev || getOrCreateOrderId())
  }, [])

  const amount = useMemo(() => {
    const n = parseInt(amountInput || "0", 10)
    return Number.isFinite(n) ? Math.max(0, n) : 0
  }, [amountInput])

  const memoFinal = useMemo(() => {
    const m = (memo || "").trim()
    if (m) return m
    return (orderIdMemo || "").trim() || "DONHANG"
  }, [memo, orderIdMemo])

  const qrUrl = useMemo(() => {
    if (amount <= 0) return ""
    return buildVietQrImgUrl(amount, memoFinal)
  }, [amount, memoFinal])

  return (
    <div className="grid gap-4 place-items-center text-center">
      <label className="grid gap-2 w-full max-w-[520px] text-left">
        {/* ✅ CHỈNH: cùng hàng + góc phải */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#FFD66B] font-semibold text-[15px]">
            Số tiền (VND)
          </span>

          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full px-4 py-2 text-[13px] font-semibold text-[#FFD66B] bg-white/10 border border-white/10 hover:bg-white/15 active:opacity-80"
            >
              Quay lại
            </button>
          ) : null}
        </div>

        <input
          autoFocus={autoFocus}
          inputMode="numeric"
          pattern="[0-9]*"
          type="number"
          min={1000}
          step={1000}
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          placeholder="VD: 50000"
          className="w-full px-5 py-4 rounded-2xl bg-black/30 border border-white/10 text-white outline-none text-[18px] font-semibold tabular-nums"
        />
      </label>

      {qrUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="VietQR MB Bank"
            className="w-full max-w-[520px] h-auto rounded-2xl border border-white/10 bg-white"
            loading="lazy"
            decoding="async"
          />

          <div className="w-full max-w-[520px] text-[15px] leading-6 text-[#FFD66B] text-left">
            <div>
              <b className="text-[#FFE7A8]">Ngân hàng:</b> MB Bank
            </div>
            <div>
              <b className="text-[#FFE7A8]">STK:</b> {ACCOUNT_NO}
            </div>
            <div>
              <b className="text-[#FFE7A8]">Tên:</b> {ACCOUNT_NAME}
            </div>
            <div>
              <b className="text-[#FFE7A8]">Nội dung:</b> {memoFinal}
            </div>
          </div>
        </>
      ) : (
        <div className="text-[14px] text-[#FFD66B]/80">Nhập số tiền để hiện QR.</div>
      )}
    </div>
  )
}

// end code