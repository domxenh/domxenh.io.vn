"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

const StickyBuyBar = dynamic(() => import("./StickyBuyBar"), {
  ssr: false,
  loading: () => null,
})

export default function StickyBuyBarClient(props: ComponentProps<any>) {
  return <StickyBuyBar {...props} />
}