import { formatPrice } from '../../lib/format'

export default function Price({ product, size = 'md', tone = 'light' }) {
  const big = size === 'lg' ? 'text-4xl' : size === 'xl' ? 'text-6xl' : 'text-xl'
  const strike = tone === 'dark' ? 'text-white/50' : 'text-slate-400'
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className={`font-display font-extrabold tabular-nums ${big}`}>{formatPrice(product.currentPrice)}</span>
      {Number(product.originalPrice) > Number(product.currentPrice) && (
        <span className={`text-sm tabular-nums line-through ${strike}`}>{formatPrice(product.originalPrice)}</span>
      )}
      {product.discountPercent > 0 && (
        <span className="rounded-md bg-brand px-1.5 py-0.5 text-xs font-bold text-white">{product.discountPercent}% off</span>
      )}
    </div>
  )
}
