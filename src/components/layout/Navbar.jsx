import { useState } from 'react'
import { Heart, LayoutDashboard, LogIn, LogOut, Package, Search, ShoppingBag, User, Zap } from 'lucide-react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { useCart } from '../../context/cart-context'
import { useWishlist } from '../../context/wishlist-context'

const iconLink =
  'relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100'

function Count({ value }) {
  if (!value) return null
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
      {value > 99 ? '99+' : value}
    </span>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const cart = useCart()
  const wishlist = useWishlist()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [draft, setDraft] = useState(null)
  const query = draft ?? params.get('q') ?? ''

  const submit = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/?q=${encodeURIComponent(q)}#catalog` : '/#catalog')
    setDraft(null)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2" aria-label="FlashSale home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            <Zap className="h-5 w-5 fill-white" />
          </span>
          <span className="hidden font-display text-xl font-extrabold sm:inline">FlashSale</span>
        </Link>

        <form onSubmit={submit} role="search" className="relative mx-auto min-w-0 max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search products"
            value={query}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search headphones, shoes, watches…"
            className="w-full rounded-xl border border-line bg-canvas py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-400 focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </form>

        <nav aria-label="Account" className="flex items-center">
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={iconLink}>
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden lg:inline">Admin</span>
            </NavLink>
          )}
          <NavLink to="/wishlist" className={iconLink} aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            <Count value={wishlist.count} />
            <span className="hidden lg:inline">Wishlist</span>
          </NavLink>
          <NavLink to="/cart" className={iconLink} aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            <Count value={cart.count} />
            <span className="hidden lg:inline">Cart</span>
          </NavLink>
          {user ? (
            <>
              <NavLink to="/orders" className={`${iconLink} hidden sm:flex`} aria-label="My orders">
                <Package className="h-5 w-5" />
                <span className="hidden lg:inline">Orders</span>
              </NavLink>
              <NavLink to="/profile" className={iconLink} aria-label="Profile">
                <User className="h-5 w-5" />
                <span className="hidden max-w-24 truncate lg:inline">{user.name.split(' ')[0]}</span>
              </NavLink>
              <button onClick={logout} className={iconLink} aria-label="Log out">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link to="/login" className="ml-1 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-soft">
              <LogIn className="h-4 w-4" /> Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
