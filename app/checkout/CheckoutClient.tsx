// app/checkout/CheckoutClient.tsx
"use client"

import { useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import VietQR from "@/components/VietQR"

function toInt(v: string | null) {
  if (!v) return 0
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? Math.max(0, n) : 0
}

export default function CheckoutClient() {
  const sp = useSearchParams()
  const router = useRouter()

  const amount = useMemo(() => toInt(sp.get("amount")), [sp])

  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-28">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold text-[#FFD66B]">
          Thanh toán chuyển khoản (VietQR)
        </h1>

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-4 py-2 font-semibold text-white bg-white/10 active:opacity-80"
        >
          Quay lại
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <VietQR initialAmount={amount} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-4">
        <button
          type="button"
          onClick={() => {
            alert("Cảm ơn bạn đã đặt hàng. Shop sẽ xác nhận sau khi nhận được chuyển khoản!")
          }}
          className="rounded-full px-6 py-3 font-semibold text-white bg-[#FF3B30] active:opacity-80"
        >
          Xác nhận đã chuyển khoản
        </button>

        <div className="mt-2 text-white/60 text-sm">
          * Nếu bạn chưa chuyển khoản, vui lòng quét QR và chuyển đúng số tiền.
        </div>
      </div>
    </main>
  )
}