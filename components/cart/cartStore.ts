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

const EVT_CHANGED = "cart:changed"
const EVT_OPEN = "cart:open"
const EVT_CLOSE = "cart:close"

let _cache: CartItem[] | null = null
let _lastSerialized: string | null = null
let _writeTimer: number | null = null

function isBrowser() {
  return typeof window !== "undefined"
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function clampQty(qty: number) {
  return Math.max(1, Math.min(99, qty))
}

function normalize(items: CartItem[]) {
  return (items || [])
    .filter(Boolean)
    .map((it) => ({
      ...it,
      qty: clampQty(Number(it.qty) || 1),
      price: Number(it.price) || 0,
      oldPrice: it.oldPrice ?? null,
    }))
    .filter((it) => it.key && it.productSlug && it.skuCode)
}

export function cartTotal(items: CartItem[]) {
  return (items || []).reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0),
    0
  )
}

function loadCache(): CartItem[] {
  if (!isBrowser()) return []
  if (_cache) return _cache

  const data = safeParse<CartItem[]>(localStorage.getItem(LS_KEY))
  _cache = Array.isArray(data) ? normalize(data) : []
  _lastSerialized = JSON.stringify(_cache)
  return _cache
}

function scheduleWrite(nextItems: CartItem[]) {
  if (!isBrowser()) return

  if (_writeTimer) window.clearTimeout(_writeTimer)

  _writeTimer = window.setTimeout(() => {
    _writeTimer = null
    const serialized = JSON.stringify(nextItems)

    if (_lastSerialized === serialized) return

    _lastSerialized = serialized
    localStorage.setItem(LS_KEY, serialized)

    window.dispatchEvent(
      new CustomEvent(EVT_CHANGED, {
        detail: {
          items: nextItems,
          total: cartTotal(nextItems),
        },
      })
    )
  }, 60)
}

export function getCart(): CartItem[] {
  return loadCache()
}

export function setCart(items: CartItem[]) {
  if (!isBrowser()) return
  const next = normalize(items)
  _cache = next
  scheduleWrite(next)
}

export function addToCart(item: CartItem) {
  if (!isBrowser()) return
  const items = loadCache()
  const next = items.slice()
  const idx = next.findIndex((x) => x.key === item.key)

  const qty = clampQty(Number(item.qty) || 1)
  if (idx >= 0) {
    const cur = next[idx]
    const newQty = clampQty(cur.qty + qty)
    if (newQty === cur.qty) return
    next[idx] = { ...cur, qty: newQty }
  } else {
    next.push({ ...item, qty })
  }

  _cache = next
  scheduleWrite(next)
}

export function updateQty(key: string, qty: number) {
  if (!isBrowser()) return
  const items = loadCache()
  const idx = items.findIndex((x) => x.key === key)
  if (idx < 0) return

  const nextQty = clampQty(Number(qty) || 1)
  if (items[idx].qty === nextQty) return

  const next = items.slice()
  next[idx] = { ...next[idx], qty: nextQty }
  _cache = next
  scheduleWrite(next)
}

export function removeFromCart(key: string) {
  if (!isBrowser()) return
  const items = loadCache()
  const next = items.filter((x) => x.key !== key)
  if (next.length === items.length) return

  _cache = next
  scheduleWrite(next)
}

export function clearCart() {
  if (!isBrowser()) return
  const items = loadCache()
  if (items.length === 0) return
  _cache = []
  scheduleWrite([])
}

export function openCart() {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(EVT_OPEN))
}

export function closeCart() {
  if (!isBrowser()) return
  window.dispatchEvent(new CustomEvent(EVT_CLOSE))
}