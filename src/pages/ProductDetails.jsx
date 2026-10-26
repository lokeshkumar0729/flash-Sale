import { useCallback, useState } from 'react'
import { ArrowLeft, Check, ShieldCheck, ShoppingBag, Star, Zap } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useCart } from '../context/cart-context'
import { useToast } from '../context/toast-context'
import { useQuery } from '../hooks/useQuery'
import { maxQuantity } from '../lib/cart'
import { formatDateTime, formatPrice } from '../lib/format'
import ProductImage from '../components/product/ProductImage'
import QuantityStepper from '../components/product/QuantityStepper'
import WishlistButton from '../components/product/WishlistButton'
import ClaimedBar from '../components/ui/ClaimedBar'
import Countdown from '../components/ui/Countdown'
import EmptyState from '../components/ui/EmptyState'
import ErrorNotice from '../components/ui/ErrorNotice'
import Price from '../components/ui/Price'
import Spinner from '../components/ui/Spinner'
import { primaryButton, secondaryButton } from '../components/ui/styles'

function SalePanel({ sale, onElapsed }) {
  if (sale.status === 'LIVE') {
    return (
      <div className="rounded-2xl bg-navy p-5 text-white">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <span className="live-dot h-2 w-2 rounded-full bg-brand" /> Flash deal is live
        </p>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">Ends in</p>
        <Countdown to={sale.endsAt} onElapsed={onElapsed} tone="dark" />
        <div className="mt-4">
          <ClaimedBar sold={sale.sold} total={sale.totalQuantity} tone="dark" />
        </div>
        <p className="mt-3 text-sm text-white/70">Limit {sale.perUserLimit} per customer at the flash price.</p>
      </div>
    )
  }
  if (sale.status === 'UPCOMING') {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5">
        <p className="text-sm font-bold">
          Flash price {formatPrice(sale.salePrice)} starts {formatDateTime(sale.startsAt)}
        </p>
        <p className="mb-2 mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">Starts in</p>
        <Countdown to={sale.startsAt} onElapsed={onElapsed} />
      </div>
    )
  }
  return (
    <p className="rounded-2xl border border-line bg-white p-4 text-sm font-semibold text-brand">
      The flash deal sold out. The regular price applies.
    </p>
  )
}

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cart = useCart()
  const toast = useToast()
  const product = useQuery(() => api.products.get(id), [id])
  const [selected, setSelected] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const { reload } = product
  const refresh = useCallback(() => reload(), [reload])

  if (product.error?.status === 404) {
    return (
      <EmptyState title="This product is no longer available" action={<Link to="/" className={primaryButton}>Back to the store</Link>} />
    )
  }
  if (product.error && !product.data) return <ErrorNotice error={product.error} onRetry={product.reload} />
  if (!product.data) return <Spinner />

  const p = product.data
  const max = maxQuantity(p)
  const qty = Math.min(quantity, Math.max(1, max))
  const available = max > 0

  const add = () => {
    cart.add(p.id, qty)
    toast.success(`${qty} × ${p.name} added to your cart`)
  }
  const buyNow = () => {
    cart.add(p.id, qty)
    navigate('/checkout')
  }

  return (
    <div>
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white">
            <ProductImage src={p.images[selected]} alt={p.name} className="aspect-square w-full" />
            {p.discountPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1.5 text-sm font-bold text-white">{p.discountPercent}% off</span>
            )}
            <WishlistButton productId={p.id} className="absolute right-4 top-4 h-11! w-11!" />
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {p.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setSelected(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === selected}
                  className={`overflow-hidden rounded-xl border-2 ${i === selected ? 'border-brand' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <ProductImage src={src} alt="" className="h-16 w-16" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{p.category}</p>
            <h1 className="mt-1 text-4xl font-extrabold leading-tight">{p.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-ink">{p.rating.toFixed(1)}</span>
              <span>({p.reviewCount} reviews)</span>
            </p>
          </div>

          <Price product={p} size="lg" />

          {p.flashSale && <SalePanel sale={p.flashSale} onElapsed={refresh} />}

          <p className="leading-relaxed text-slate-600">{p.description}</p>

          <div className="flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} onChange={setQuantity} max={Math.max(1, max)} />
            <p className={`text-sm font-semibold ${p.stock <= 5 ? 'text-brand' : 'text-ok'}`}>
              {p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left in stock` : 'In stock'}
            </p>
          </div>
          {p.flashSale?.status === 'LIVE' && qty === max && max === p.flashSale.perUserLimit && (
            <p className="text-sm text-slate-500">That is the flash-price limit for one customer.</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button className={`${primaryButton} flex-1 py-3.5 text-base`} onClick={buyNow} disabled={!available}>
              <Zap className="h-5 w-5" /> Buy now
            </button>
            <button className={`${secondaryButton} flex-1 py-3.5 text-base`} onClick={add} disabled={!available}>
              <ShoppingBag className="h-5 w-5" /> Add to cart
            </button>
          </div>

          {p.features.length > 0 && (
            <section aria-labelledby="features" className="rounded-2xl border border-line bg-white p-5">
              <h2 id="features" className="mb-3 text-lg font-bold">
                Highlights
              </h2>
              <ul className="space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-ok" /> {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4" /> Prices are confirmed by the server at checkout.
          </p>
        </div>
      </div>
    </div>
  )
}
