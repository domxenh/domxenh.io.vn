// components/cart/cartStore.ts
export type CartItem = {
  key: string
  productSlug: string
  productName: string
  skuCode: string
  skuLabel: string
  image?: string
  price: number
  oldPrice: number | null
  qty: number
}

const LS_KEY = "domxenh_cart_v1"

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const data = safeParse<CartItem[]>(localStorage.getItem(LS_KEY))
  return Array.isArray(data) ? data : []
}

export function setCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(LS_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent("cart:changed"))
}

export function addToCart(item: CartItem) {
  const items = getCart()
  const idx = items.findIndex((x) => x.key === item.key)
  if (idx >= 0) {
    items[idx] = { ...items[idx], qty: Math.min(99, items[idx].qty + item.qty) }
  } else {
    items.push({ ...item, qty: Math.max(1, Math.min(99, item.qty)) })
  }
  setCart(items)
}

export function updateQty(key: string, qty: number) {
  const items = getCart()
  const idx = items.findIndex((x) => x.key === key)
  if (idx < 0) return
  items[idx] = { ...items[idx], qty: Math.max(1, Math.min(99, qty)) }
  setCart(items)
}

export function removeFromCart(key: string) {
  setCart(getCart().filter((x) => x.key !== key))
}

export function clearCart() {
  setCart([])
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0)
}

export function openCart() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("cart:open"))
}

export function closeCart() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent("cart:close"))
}