// app/components/VietQR.tsx
"use client"

import { useEffect, useMemo, useState } from "react"

const BANK_BIN = "970422" // MB Bank
const ACCOUNT_NO = "19089599999999"
const ACCOUNT_NAME = "Hoàng Minh Quang"
const TEMPLATE = "compact2" // compact2/compact/qr_only/print
const DEFAULT_MEMO = "Chuyển khoản qua QR"

function buildVietQrImgUrl(amount: number, memo: string) {
  const addInfo = encodeURIComponent(memo)
  const accountName = encodeURIComponent(ACCOUNT_NAME)
  return `https://img.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${amount}&addInfo=${addInfo}&accountName=${accountName}`
}

type Props = {
  initialAmount?: number
  memo?: string
  autoFocus?: boolean
}

export default function VietQR({ initialAmount = 0, memo = DEFAULT_MEMO, autoFocus }: Props) {
  const [amountInput, setAmountInput] = useState<string>("")

  useEffect(() => {
    // Tự điền số tiền -> hiện QR ngay
    if (initialAmount > 0) setAmountInput(String(Math.round(initialAmount)))
    else setAmountInput("")
  }, [initialAmount])

  const amount = useMemo(() => {
    const n = parseInt(amountInput || "0", 10)
    return Number.isFinite(n) ? Math.max(0, n) : 0
  }, [amountInput])

  const qrUrl = useMemo(() => {
    if (amount <= 0) return ""
    return buildVietQrImgUrl(amount, memo)
  }, [amount, memo])

  return (
    <div className="grid gap-3 max-w-[380px]">
      <label className="grid gap-2">
        <span className="text-white/80 text-sm font-semibold">Số tiền (VND)</span>
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
          className="px-4 py-3 rounded-2xl bg-black/30 border border-white/10 text-white outline-none"
        />
      </label>

      {qrUrl ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="VietQR MB Bank"
            className="w-full h-auto rounded-2xl border border-white/10"
            loading="lazy"
            decoding="async"
          />
          <div className="text-[13px] leading-5 text-white/75">
            <div>
              <b className="text-white">Ngân hàng:</b> MB Bank
            </div>
            <div>
              <b className="text-white">STK:</b> {ACCOUNT_NO}
            </div>
            <div>
              <b className="text-white">Tên:</b> {ACCOUNT_NAME}
            </div>
            <div>
              <b className="text-white">Nội dung:</b> {memo}
            </div>
          </div>
        </>
      ) : (
        <div className="text-[13px] text-white/60">Nhập số tiền để hiện QR.</div>
      )}
    </div>
  )
}