import { useState } from 'react'
import { KeyRound, Mail, Phone, User, Zap } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { primaryButton } from '../components/ui/styles'

const SHOW_DEMO = import.meta.env.VITE_SHOW_DEMO !== 'false'
const DEMO = {
  customer: { email: 'customer@example.com', password: 'Customer@123' },
  admin: { email: 'admin@example.com', password: 'Admin@123' },
}

const inputWithIcon =
  'w-full rounded-xl border border-line bg-white py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20'

function IconField({ id, label, icon: Icon, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input id={id} className={inputWithIcon} aria-invalid={Boolean(error)} {...props} />
      </div>
      {error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

/** One page for both log in and sign up; `mode` picks which. */
export default function AuthPage({ mode }) {
  const signup = mode === 'signup'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={user.role === 'ADMIN' ? '/admin' : from ?? '/'} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const found = {}
    if (signup && !form.name.trim()) found.name = 'Name is required'
    if (!form.email.trim()) found.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) found.email = 'Enter a valid email address'
    if (signup && form.phone && !/^[6-9]\d{9}$/.test(form.phone)) found.phone = 'Enter a valid 10-digit mobile number'
    if (!form.password) found.password = 'Password is required'
    else if (signup && form.password.length < 8) found.password = 'Use at least 8 characters'
    return found
  }

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    try {
      const me = signup
        ? await register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone, password: form.password })
        : await login(form.email.trim(), form.password, remember)
      navigate(me.role === 'ADMIN' ? '/admin' : from ?? '/', { replace: true })
    } catch (err) {
      if (Object.keys(err.fieldErrors ?? {}).length) setErrors(err.fieldErrors)
      else setFormError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
            <Zap className="h-5 w-5 fill-white" />
          </span>
          <span className="font-display text-2xl font-extrabold">FlashSale</span>
        </Link>
        <div className="relative">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
            <span className="live-dot h-2 w-2 rounded-full bg-brand" /> Deals are live
          </p>
          <h1 className="max-w-lg font-display text-5xl font-extrabold leading-[1.05]">Real deals. Real countdowns. Honest stock.</h1>
          <p className="mt-5 max-w-md text-lg text-white/70">
            When a flash sale says 14 left, there are 14 left. Limits are enforced on the server, so nobody gets the last one twice.
          </p>
        </div>
        <p className="relative text-sm text-white/45">Spring Boot · MySQL · React</p>
      </aside>

      <main className="flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
              <Zap className="h-5 w-5 fill-white" />
            </span>
            <span className="font-display text-xl font-extrabold">FlashSale</span>
          </Link>

          <h2 className="text-3xl font-extrabold">{signup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            {signup ? 'Sign up to claim flash deals and track your orders.' : 'Log in to check out and track your orders.'}
          </p>

          <form onSubmit={submit} noValidate className="mt-7 space-y-4">
            {formError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                {formError}
              </p>
            )}
            {signup && (
              <IconField id="name" label="Full name" icon={User} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            )}
            <IconField id="email" label="Email" icon={Mail} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="username" placeholder="you@example.com" />
            {signup && (
              <IconField id="phone" label="Mobile (optional)" icon={Phone} inputMode="numeric" maxLength={10} value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" />
            )}
            <IconField id="password" label="Password" icon={KeyRound} type="password" value={form.password} onChange={set('password')} error={errors.password} autoComplete={signup ? 'new-password' : 'current-password'} />

            {!signup && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-brand" />
                Keep me signed in on this device
              </label>
            )}

            <button type="submit" disabled={busy} className={`${primaryButton} w-full py-3`}>
              {busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {signup ? 'Already have an account? ' : 'New here? '}
            <Link to={signup ? '/login' : '/signup'} state={location.state} className="font-semibold text-brand hover:underline">
              {signup ? 'Log in' : 'Create an account'}
            </Link>
          </p>

          {SHOW_DEMO && !signup && (
            <div className="mt-8 rounded-xl border border-dashed border-line bg-canvas p-4 text-sm">
              <p className="font-semibold">Try the demo</p>
              <p className="mt-0.5 text-slate-500">Fill in a demo account, then press Log in.</p>
              <div className="mt-3 flex gap-2">
                {Object.entries(DEMO).map(([kind, creds]) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => {
                      setForm((f) => ({ ...f, ...creds }))
                      setErrors({})
                    }}
                    className="rounded-lg border border-line bg-white px-3 py-1.5 font-medium capitalize hover:bg-slate-50"
                  >
                    {kind}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
