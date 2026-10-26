import { ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/cart-context'
import { useCartLines } from '../hooks/useCartLines'
import { estimateTotals, maxQuantity } from '../lib/cart'
import { formatPrice } from '../lib/format'
import ProductImage from '../components/product/ProductImage'
import QuantityStepper from '../components/product/QuantityStepper'
import EmptyState from '../components/ui/EmptyState'
import ErrorNotice from '../components/ui/ErrorNotice'
import Spinner from '../components/ui/Spinner'
import { primaryButton, secondaryButton } from '../components/ui/styles'

export function OrderSummary({ lines, children }) {
  const totals = estimateTotals(lines.filter((l) => l.product))
  const row = 'flex justify-between text-sm'
  return (
    <aside className="h-fit rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-24" aria-label="Order summary">
      <h2 className="mb-4 text-lg font-bold">Order summary</h2>
      <div className="space-y-2.5">
        <p className={row}>
          <span className="text-slate-600">Subtotal</span>
          <span className="tabular-nums">{formatPrice(totals.subtotal)}</span>
        </p>
        {totals.savings > 0 && (
          <p className={`${row} text-ok`}>
            <span>You save</span>
            <span className="tabular-nums">−{formatPrice(totals.savings)}</span>
          </p>
        )}
        <p className={row}>
          <span className="text-slate-600">Delivery</span>
          <span className="tabular-nums">{totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery)}</span>
        </p>
        <p className="flex justify-between border-t border-line pt-3 text-lg font-bold">
          <span>Total</span>
          <span className="font-display tabular-nums">{formatPrice(totals.total)}</span>
        </p>
      </div>
      <p className="mt-3 text-xs text-slate-500">Free delivery on orders of {formatPrice(999)} or more.</p>
      {children}
    </aside>
  )
}

export default function Cart() {
  const cart = useCart()
  const { lines, loaded, error, reload } = useCartLines()

  if (cart.items.length === 0) {
    return (
      <div className="rounded-2xl border border-line bg-white">
        <EmptyState title="Your cart is empty" action={<Link to="/" className={primaryButton}>Browse deals</Link>}>
          Add something from the store and it will wait for you here.
        </EmptyState>
      </div>
    )
  }
  if (error && !loaded) return <ErrorNotice error={error} onRetry={reload} />
  if (!loaded) return <Spinner />

  const blocked = lines.some((l) => !l.product || l.quantity > maxQuantity(l.product))

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <ul className="space-y-4">
          {lines.map(({ productId, quantity, product }) => {
            if (!product) {
              return (
                <li key={productId} className="flex items-center justify-between rounded-2xl border border-line bg-white p-5">
                  <p className="text-sm text-slate-600">An item in your cart is no longer available.</p>
                  <button className={secondaryButton} onClick={() => cart.remove(productId)}>Remove</button>
                </li>
              )
            }
            const max = maxQuantity(product)
            const tooMany = quantity > max
            return (
              <li key={productId} className="flex gap-4 rounded-2xl border border-line bg-white p-4 sm:gap-5 sm:p-5">
                <Link to={`/products/${productId}`} className="shrink-0">
                  <ProductImage src={product.images[0]} alt="" className="h-24 w-24 rounded-xl sm:h-28 sm:w-28" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/products/${productId}`} className="line-clamp-1 font-bold hover:underline">{product.name}</Link>
                      <p className="mt-0.5 flex flex-wrap items-baseline gap-2">
                        <span className="font-display text-lg font-extrabold tabular-nums">{formatPrice(product.currentPrice)}</span>
                        {Number(product.originalPrice) > Number(product.currentPrice) && (
                          <span className="text-sm text-slate-400 line-through tabular-nums">{formatPrice(product.originalPrice)}</span>
                        )}
                        {product.flashSale?.status === 'LIVE' && (
                          <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-xs font-bold text-brand">Flash price</span>
                        )}
                      </p>
                    </div>
                    <button onClick={() => cart.remove(productId)} aria-label={`Remove ${product.name}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-red-600">
                      <Trash2 className="h-[18px] w-[18px]" />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-3">
                    <QuantityStepper value={Math.min(quantity, Math.max(1, max))} onChange={(q) => cart.setQuantity(productId, q)} max={Math.max(1, max)} />
                    {max === 0 && <p className="text-sm font-semibold text-brand">Currently unavailable</p>}
                    {tooMany && max > 0 && (
                      <p className="text-sm font-semibold text-brand">
                        Only {max} available.{' '}
                        <button className="underline" onClick={() => cart.setQuantity(productId, max)}>Use {max}</button>
                      </p>
                    )}
                    {tooMany && max === 0 && (
                      <button className="text-sm font-semibold text-brand underline" onClick={() => cart.remove(productId)}>Remove</button>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <OrderSummary lines={lines}>
          <Link to="/checkout" aria-disabled={blocked} className={`${primaryButton} mt-5 w-full py-3.5 text-base ${blocked ? 'pointer-events-none opacity-50' : ''}`}>
            <ShoppingBag className="h-5 w-5" /> Checkout
          </Link>
          {blocked && <p className="mt-2 text-center text-xs text-brand">Fix the items marked above to continue.</p>}
        </OrderSummary>
      </div>
    </div>
  )
}
