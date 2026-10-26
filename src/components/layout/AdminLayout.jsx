import { BarChart3, LogOut, Package, ReceiptText, Store, Zap } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/flash-sales', label: 'Flash sales', icon: Zap },
  { to: '/admin/orders', label: 'Orders', icon: ReceiptText },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const link = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
      isActive ? 'bg-white/12 text-white' : 'text-white/65 hover:bg-white/8 hover:text-white'
    }`

  return (
    <div className="min-h-screen lg:flex">
      <aside className="bg-navy text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:p-5">
        <div className="flex items-center justify-between px-4 py-3 lg:px-1 lg:py-0">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
              <Zap className="h-5 w-5 fill-white" />
            </span>
            <span className="font-display text-lg font-extrabold">FlashSale</span>
            <span className="rounded-md bg-white/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">Admin</span>
          </Link>
          <button onClick={logout} className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden" aria-label="Log out">
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-8 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={link}>
              <Icon className="h-[18px] w-[18px]" /> <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden space-y-1 border-t border-white/10 pt-4 lg:block">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65 hover:bg-white/8 hover:text-white">
            <Store className="h-[18px] w-[18px]" /> View store
          </Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white/65 hover:bg-white/8 hover:text-white">
            <LogOut className="h-[18px] w-[18px]" /> Log out
          </button>
          <p className="truncate px-3.5 pt-2 text-xs text-white/40">{user.email}</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}
