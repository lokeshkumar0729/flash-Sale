import { useCallback, useEffect, useMemo, useState } from 'react'
import { MAX_PER_ITEM } from '../lib/cart'
import { CartContext } from './cart-context'

const STORAGE_KEY = 'flashsale.cart'

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed)
      ? parsed.filter((i) => Number.isInteger(i?.productId) && Number.isInteger(i?.quantity) && i.quantity > 0)
      : []
  } catch {
    return []
  }
}

/**
 * The cart only remembers product ids and quantities. Prices, stock and flash deals are always read from the
 * server, so a stale cart can never show (or send) an outdated price.
 */
export default function CartProvider({ children }) {
  const [items, setItems] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage can be unavailable (private mode); the cart then lasts for this visit only
    }
  }, [items])

  const add = useCallback((productId, quantity = 1) => {
    setItems((list) => {
      const existing = list.find((i) => i.productId === productId)
      if (!existing) return [...list, { productId, quantity: Math.min(quantity, MAX_PER_ITEM) }]
      return list.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_PER_ITEM) } : i,
      )
    })
  }, [])

  const setQuantity = useCallback((productId, quantity) => {
    setItems((list) =>
      list.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, MAX_PER_ITEM)) } : i)),
    )
  }, [])

  const remove = useCallback((productId) => setItems((list) => list.filter((i) => i.productId !== productId)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      add,
      setQuantity,
      remove,
      clear,
    }),
    [items, add, setQuantity, remove, clear],
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
