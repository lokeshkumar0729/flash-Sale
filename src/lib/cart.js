export const MAX_PER_ITEM = 10
export const FREE_DELIVERY_FROM = 999
export const DELIVERY_CHARGE = 49

/** The most units of a product a customer can put in one order right now (the server enforces the same rules). */
export function maxQuantity(product) {
  const sale = product.flashSale
  let max = Math.min(MAX_PER_ITEM, product.stock)
  if (sale?.status === 'LIVE') max = Math.min(max, sale.remaining, sale.perUserLimit)
  return Math.max(0, max)
}

/** A display-only estimate. The server prices the order again when it is placed. */
export function estimateTotals(lines) {
  let subtotal = 0
  let savings = 0
  for (const { product, quantity } of lines) {
    subtotal += Number(product.currentPrice) * quantity
    savings += Math.max(0, Number(product.originalPrice) - Number(product.currentPrice)) * quantity
  }
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_CHARGE
  return { subtotal, savings, delivery, total: subtotal + delivery }
}

export function newIdempotencyKey() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`
}
