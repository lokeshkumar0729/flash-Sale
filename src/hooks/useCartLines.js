import { useMemo } from 'react'
import { api } from '../api/client'
import { useCart } from '../context/cart-context'
import { useQuery } from './useQuery'

/** Joins the stored cart (ids and quantities) with fresh product data from the server. */
export function useCartLines() {
  const cart = useCart()
  const ids = cart.items.map((i) => i.productId)
  const query = useQuery(() => api.products.byIds(ids), [ids.join(',')])

  const lines = useMemo(() => {
    const byId = new Map((query.data ?? []).map((p) => [p.id, p]))
    return cart.items.map((item) => ({ ...item, product: byId.get(item.productId) ?? null }))
  }, [cart.items, query.data])

  return { lines, loaded: query.data !== null || cart.items.length === 0, error: query.error, reload: query.reload }
}
