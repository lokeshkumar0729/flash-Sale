import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import ClaimedBar from '../ui/ClaimedBar'
import Price from '../ui/Price'
import ProductImage from './ProductImage'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product }) {
  const sale = product.flashSale
  const live = sale?.status === 'LIVE'
  const soldOutDeal = sale?.status === 'SOLD_OUT'
  const unavailable = product.stock === 0

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="flex flex-1 flex-col" aria-label={product.name}>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <ProductImage src={product.images[0]} alt="" className="h-full w-full transition duration-500 group-hover:scale-105" />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {live && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-white" /> Flash deal
              </span>
            )}
            {sale?.status === 'UPCOMING' && (
              <span className="rounded-full bg-navy px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Coming soon</span>
            )}
          </div>
          {unavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 font-display text-lg font-bold">Out of stock</div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{product.category}</p>
          <h3 className="line-clamp-1 text-base font-bold">{product.name}</h3>
          <p className="flex items-center gap-1 text-sm text-slate-600">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-ink">{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </p>
          <div className="mt-auto pt-1">
            <Price product={product} />
            {live && (
              <div className="mt-3">
                <ClaimedBar sold={sale.sold} total={sale.totalQuantity} />
              </div>
            )}
            {soldOutDeal && <p className="mt-2 text-xs font-semibold text-brand">Flash deal sold out</p>}
          </div>
        </div>
      </Link>
      <WishlistButton productId={product.id} className="absolute right-3 top-3" />
    </article>
  )
}
