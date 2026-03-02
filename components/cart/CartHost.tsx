// components/cart/CartHost.tsx
"use client"

import FloatingCartButton from "./FloatingCartButton"
import CartPopup from "./CartPopup"

export default function CartHost() {
  return (
    <>
      <FloatingCartButton />
      <CartPopup />
    </>
  )
}