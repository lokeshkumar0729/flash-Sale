import { useCallback, useEffect, useMemo, useState } from 'react'
import { api, tokenStore, UNAUTHORIZED_EVENT } from '../api/client'
import { AuthContext } from './auth-context'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // If a token is stored we must ask the server who it belongs to before deciding what to show.
  const [loading, setLoading] = useState(() => Boolean(tokenStore.get()))

  useEffect(() => {
    if (!tokenStore.get()) return undefined
    let active = true
    api.auth
      .me()
      .then((me) => active && setUser(me))
      .catch(() => tokenStore.clear())
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  // The API client fires this when any request comes back 401 (expired or revoked token).
  useEffect(() => {
    const onUnauthorized = () => setUser(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const login = useCallback(async (email, password, remember) => {
    const { token, user: me } = await api.auth.login(email, password)
    tokenStore.set(token, remember)
    setUser(me)
    return me
  }, [])

  const register = useCallback(async (body) => {
    const { token, user: me } = await api.auth.register(body)
    tokenStore.set(token, false)
    setUser(me)
    return me
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser }),
    [user, loading, login, register, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
