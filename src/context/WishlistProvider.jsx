import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { useAuth } from './auth-context'
import { WishlistContext } from './wishlist-context'

/** Keeps the ids of wished products so hearts can be drawn without a request per card. */
export default function WishlistProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  // Remember which user the ids belong to, so a logout or account switch can never show someone else's hearts.
  const [state, setState] = useState({ userId: null, ids: new Set() })

  useEffect(() => {
    if (userId === null || user.role !== 'CUSTOMER') return undefined
    let active = true
    api.wishlist
      .list()
      .then((products) => active && setState({ userId, ids: new Set(products.map((p) => p.id)) }))
      .catch(() => {})
    return () => {
      active = false
    }
    // role cannot change for a given user id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const ids = useMemo(() => (state.userId === userId ? state.ids : new Set()), [state, userId])

  const has = useCallback((productId) => ids.has(productId), [ids])

  /** Adds or removes a product. Resolves to true when the product is now in the wishlist. */
  const toggle = useCallback(
    async (productId) => {
      const wished = ids.has(productId)
      if (wished) await api.wishlist.remove(productId)
      else await api.wishlist.add(productId)
      setState((prev) => {
        const next = new Set(prev.userId === userId ? prev.ids : [])
        if (wished) next.delete(productId)
        else next.add(productId)
        return { userId, ids: next }
      })
      return !wished
    },
    [ids, userId],
  )

  const value = useMemo(() => ({ ids, has, toggle, count: ids.size }), [ids, has, toggle])
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
