// Base URL of the API. Defaults to "/api" (Vite dev proxy locally, nginx proxy in Docker).
// For a separately hosted backend set VITE_API_URL=https://your-api.example.com/api at build time.
const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')
const TOKEN_KEY = 'flashsale.token'

export const UNAUTHORIZED_EVENT = 'flashsale:unauthorized'

// "Keep me signed in" uses localStorage, otherwise the token lives only for the browser session.
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY),
  set: (token, remember) => {
    tokenStore.clear()
    ;(remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, token)
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  },
}

export class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request(path, { method = 'GET', body, params, headers: extra, auth = true } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin)
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== false) {
      url.searchParams.set(key, String(value))
    }
  })

  const headers = { ...extra }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.')
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && auth) {
      tokenStore.clear()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw new ApiError(
      response.status,
      data?.message ?? 'Something went wrong. Please try again.',
      data?.fieldErrors ?? {},
    )
  }
  return data
}

export const api = {
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
    register: (body) => request('/auth/register', { method: 'POST', body, auth: false }),
    me: () => request('/auth/me'),
    updateProfile: (body) => request('/auth/me', { method: 'PUT', body }),
    changePassword: (body) => request('/auth/password', { method: 'PUT', body }),
  },

  products: {
    list: (params) => request('/products', { params, auth: false }),
    get: (id) => request(`/products/${id}`, { auth: false }),
    byIds: (ids) => (ids.length ? request('/products/by-ids', { params: { ids: ids.join(',') }, auth: false }) : Promise.resolve([])),
    categories: () => request('/products/categories', { auth: false }),
  },

  flashSales: {
    live: () => request('/flash-sales/live', { auth: false }),
    upcoming: () => request('/flash-sales/upcoming', { auth: false }),
  },

  wishlist: {
    list: () => request('/wishlist'),
    add: (productId) => request(`/wishlist/${productId}`, { method: 'PUT' }),
    remove: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
  },

  orders: {
    // The Idempotency-Key makes retries safe: the same key always returns the same order.
    place: (body, idempotencyKey) =>
      request('/orders', { method: 'POST', body, headers: { 'Idempotency-Key': idempotencyKey } }),
    list: (params) => request('/orders', { params }),
    get: (id) => request(`/orders/${id}`),
    cancel: (id) => request(`/orders/${id}/cancel`, { method: 'POST' }),
  },

  admin: {
    stats: () => request('/admin/stats'),
    products: {
      list: (params) => request('/admin/products', { params }),
      create: (body) => request('/admin/products', { method: 'POST', body }),
      update: (id, body) => request(`/admin/products/${id}`, { method: 'PUT', body }),
      deactivate: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),
    },
    flashSales: {
      list: (params) => request('/admin/flash-sales', { params }),
      create: (body) => request('/admin/flash-sales', { method: 'POST', body }),
      end: (id) => request(`/admin/flash-sales/${id}/end`, { method: 'POST' }),
    },
    orders: {
      list: (params) => request('/admin/orders', { params }),
      updateStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: { status } }),
    },
  },
}
