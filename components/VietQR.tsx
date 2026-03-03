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
    <div className="grid gap-4 place-items-center text-center">
      <label className="grid gap-2 w-full max-w-[520px] text-left">
        <span className="text-[#FFD66B] font-semibold text-[15px] drop-shadow-[0_0_12px_rgba(255,214,107,0.35)]">
          Số tiền (VND)
        </span>
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

          <div className="w-full max-w-[520px] text-[15px] leading-6 text-[#FFD66B] drop-shadow-[0_0_12px_rgba(255,214,107,0.25)] text-left">
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
              <b className="text-[#FFE7A8]">Nội dung:</b> {memo}
            </div>
          </div>
        </>
      ) : (
        <div className="text-[14px] text-[#FFD66B]/80">Nhập số tiền để hiện QR.</div>
      )}
    </div>
  )
}