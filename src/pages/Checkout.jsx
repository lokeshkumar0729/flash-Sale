import { useRef, useState } from 'react'
import { Lock } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/auth-context'
import { useCart } from '../context/cart-context'
import { useToast } from '../context/toast-context'
import { useCartLines } from '../hooks/useCartLines'
import { estimateTotals, maxQuantity, newIdempotencyKey } from '../lib/cart'
import { formatPrice } from '../lib/format'
import { PAYMENT_LABEL } from '../lib/orderStatus'
import Field from '../components/ui/Field'
import ErrorNotice from '../components/ui/ErrorNotice'
import Spinner from '../components/ui/Spinner'
import { inputClass, primaryButton } from '../components/ui/styles'
import { OrderSummary } from './Cart'

const PAYMENTS = ['UPI', 'CARD', 'NETBANKING', 'COD']

const REQUIRED = {
  fullName: 'Full name is required',
  phone: 'Phone number is required',
  email: 'Email is required',
  addressLine: 'Address is required',
  city: 'City is required',
  state: 'State is required',
  pincode: 'Pincode is required',
}

export default function Checkout() {
  const { user } = useAuth()
  const cart = useCart()
  const toast = useToast()
  const navigate = useNavigate()
  const { lines, loaded, error, reload } = useCartLines()

  // One key per visit to this page. If the request is retried (double click, flaky network),
  // the server recognises the key and returns the same order instead of creating a second one.
  const idempotencyKey = useRef(newIdempotencyKey())

  const [form, setForm] = useState({
    fullName: user.name,
    phone: user.phone ?? '',
    email: user.email,
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [payment, setPayment] = useState('UPI')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  if (cart.items.length === 0 && !busy) return <Navigate to="/cart" replace />
  if (error && !loaded) return <ErrorNotice error={error} onRetry={reload} />
  if (!loaded) return <Spinner />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const problem = lines.some((l) => !l.product || l.quantity > maxQuantity(l.product))

  const validate = () => {
    const found = {}
    for (const [key, message] of Object.entries(REQUIRED)) {
      if (!form[key].trim()) found[key] = message
    }
    if (!found.phone && !/^[6-9]\d{9}$/.test(form.phone.trim())) found.phone = 'Enter a valid 10-digit mobile number'
    if (!found.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) found.email = 'Enter a valid email address'
    if (!found.pincode && !/^\d{6}$/.test(form.pincode.trim())) found.pincode = 'Pincode must be 6 digits'
    return found
  }

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return
    if (problem) {
      toast.error('Some items in your cart are no longer available in that quantity. Review your cart first.')
      navigate('/cart')
      return
    }

    setBusy(true)
    try {
      const order = await api.orders.place(
        {
          items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          address: Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])),
          paymentMethod: payment,
        },
        idempotencyKey.current,
      )
      cart.clear()
      navigate(`/orders/${order.id}`, { replace: true, state: { placed: true } })
    } catch (err) {
      setBusy(false)
      if (err.status === 409) {
        // The deal or the stock changed under us. Show why and refresh what the cart says.
        toast.error(err.message)
        reload()
        return
      }
      const mapped = {}
      Object.entries(err.fieldErrors ?? {}).forEach(([key, message]) => {
        mapped[key.replace('address.', '')] = message
      })
      if (Object.keys(mapped).length) setErrors(mapped)
      else toast.error(err.message)
    }
  }

  const totals = estimateTotals(lines.filter((l) => l.product))

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>
      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-line bg-white p-6" aria-labelledby="delivery">
            <h2 id="delivery" className="mb-5 text-lg font-bold">
              Delivery address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
                <input id="fullName" className={inputClass} value={form.fullName} onChange={set('fullName')} autoComplete="name" />
              </Field>
              <Field label="Mobile number" htmlFor="phone" error={errors.phone}>
                <input id="phone" className={inputClass} inputMode="numeric" maxLength={10} value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email} className="sm:col-span-2">
                <input id="email" type="email" className={inputClass} value={form.email} onChange={set('email')} autoComplete="email" />
              </Field>
              <Field label="Address" htmlFor="addressLine" error={errors.addressLine} className="sm:col-span-2">
                <input id="addressLine" className={inputClass} value={form.addressLine} onChange={set('addressLine')} autoComplete="street-address" placeholder="House no., street, area" />
              </Field>
              <Field label="City" htmlFor="city" error={errors.city}>
                <input id="city" className={inputClass} value={form.city} onChange={set('city')} autoComplete="address-level2" />
              </Field>
              <Field label="State" htmlFor="state" error={errors.state}>
                <input id="state" className={inputClass} value={form.state} onChange={set('state')} autoComplete="address-level1" />
              </Field>
              <Field label="Pincode" htmlFor="pincode" error={errors.pincode}>
                <input id="pincode" className={inputClass} inputMode="numeric" maxLength={6} value={form.pincode} onChange={set('pincode')} autoComplete="postal-code" />
              </Field>
            </div>
          </section>

          <fieldset className="rounded-2xl border border-line bg-white p-6">
            <legend className="px-1 text-lg font-bold">Payment</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {PAYMENTS.map((method) => (
                <label
                  key={method}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition ${
                    payment === method ? 'border-brand bg-brand-soft' : 'border-line hover:bg-slate-50'
                  }`}
                >
                  <input type="radio" name="payment" value={method} checked={payment === method} onChange={() => setPayment(method)} className="h-4 w-4 accent-brand" />
                  {PAYMENT_LABEL[method]}
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">This is a demo store: payments are simulated and no money moves.</p>
          </fieldset>
        </div>

        <OrderSummary lines={lines}>
          <ul className="mt-4 space-y-1 border-t border-line pt-4 text-sm text-slate-600">
            {lines.filter((l) => l.product).map((l) => (
              <li key={l.productId} className="flex justify-between gap-3">
                <span className="truncate">
                  {l.quantity} × {l.product.name}
                </span>
                <span className="tabular-nums">{formatPrice(Number(l.product.currentPrice) * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <button type="submit" disabled={busy} className={`${primaryButton} mt-5 w-full py-3.5 text-base`}>
            <Lock className="h-4 w-4" /> {busy ? 'Placing order…' : `Place order · ${formatPrice(totals.total)}`}
          </button>
        </OrderSummary>
      </form>
    </div>
  )
}
