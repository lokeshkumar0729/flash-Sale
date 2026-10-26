import { useCallback, useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import { useQuery } from '../hooks/useQuery'
import { formatDateTime, formatPrice } from '../lib/format'
import ProductCard from '../components/product/ProductCard'
import ProductImage from '../components/product/ProductImage'
import ClaimedBar from '../components/ui/ClaimedBar'
import Countdown from '../components/ui/Countdown'
import EmptyState from '../components/ui/EmptyState'
import ErrorNotice from '../components/ui/ErrorNotice'
import Pagination from '../components/ui/Pagination'
import Price from '../components/ui/Price'
import Spinner from '../components/ui/Spinner'
import { inputClass } from '../components/ui/styles'

const PAGE_SIZE = 8
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

/** The big card for the sale that ends first. */
function Hero({ product, onElapsed }) {
  const sale = product.flashSale
  return (
    <section className="relative overflow-hidden rounded-3xl bg-navy text-white" aria-label="Featured flash deal">
      <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-brand/30 blur-3xl" aria-hidden="true" />
      <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
        <div>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
            <span className="live-dot h-2 w-2 rounded-full bg-brand" /> Flash sale · ends soon
          </p>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl">{product.name}</h1>
          <p className="mt-4 max-w-md text-white/70">{product.description}</p>

          <div className="mt-6">
            <Price product={product} size="xl" tone="dark" />
          </div>

          <div className="mt-6 max-w-sm space-y-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/60">Ends in</p>
              <Countdown to={sale.endsAt} onElapsed={onElapsed} tone="dark" />
            </div>
            <ClaimedBar sold={sale.sold} total={sale.totalQuantity} tone="dark" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to={`/products/${product.id}`} className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white transition hover:bg-brand-dark">
              Grab this deal <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="text-sm text-white/60">Limit {sale.perUserLimit} per customer</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute inset-4 rotate-3 rounded-3xl bg-brand" aria-hidden="true" />
          <ProductImage src={product.images[0]} alt={product.name} className="relative aspect-square w-full -rotate-2 rounded-3xl shadow-2xl" />
        </div>
      </div>
    </section>
  )
}

function DealCard({ product, onElapsed }) {
  const sale = product.flashSale
  return (
    <Link to={`/products/${product.id}`} className="flex gap-4 rounded-2xl border border-line bg-white p-4 transition hover:shadow-md">
      <ProductImage src={product.images[0]} alt="" className="h-24 w-24 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-bold">{product.name}</h3>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="font-display text-lg font-extrabold tabular-nums">{formatPrice(sale.salePrice)}</span>
          <span className="text-xs text-slate-400 line-through tabular-nums">{formatPrice(product.originalPrice)}</span>
        </div>
        <div className="mt-2">
          <ClaimedBar sold={sale.sold} total={sale.totalQuantity} compact />
        </div>
        <p className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>{Math.max(0, sale.totalQuantity - sale.sold)} left</span>
          <Countdown to={sale.endsAt} onElapsed={onElapsed} />
        </p>
      </div>
    </Link>
  )
}

export default function Home() {
  const [params, setParams] = useSearchParams()
  const location = useLocation()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'newest'
  const page = Number(params.get('page') ?? 0) || 0
  const catalogRef = useRef(null)

  const live = useQuery(() => api.flashSales.live(), [])
  const upcoming = useQuery(() => api.flashSales.upcoming(), [])
  const categories = useQuery(() => api.products.categories(), [])
  const products = useQuery(() => api.products.list({ q, category, sort, page, size: PAGE_SIZE }), [q, category, sort, page])

  const refreshDeals = useCallback(() => {
    live.reload()
    upcoming.reload()
    products.reload()
    // reload functions are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The navbar search jumps to #catalog; scroll there once the results are on screen.
  useEffect(() => {
    if (location.hash === '#catalog') catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash, q])

  const update = (changes) => {
    const next = new URLSearchParams(params)
    Object.entries({ page: 0, ...changes }).forEach(([key, value]) => {
      if (value === '' || value === 0 || (key === 'sort' && value === 'newest')) next.delete(key)
      else next.set(key, String(value))
    })
    setParams(next, { replace: true })
  }

  const liveDeals = (live.data ?? []).filter((p) => p.flashSale.status === 'LIVE')
  const hero = liveDeals[0]
  const restOfDeals = (live.data ?? []).filter((p) => p !== hero)
  const rows = products.data?.content ?? []
  const filtering = Boolean(q || category)

  return (
    <div className="space-y-14">
      {!filtering && hero && <Hero product={hero} onElapsed={refreshDeals} />}

      {!filtering && restOfDeals.length > 0 && (
        <section aria-labelledby="more-deals">
          <h2 id="more-deals" className="mb-5 text-2xl font-extrabold">
            More deals running now
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {restOfDeals.map((p) => (
              <DealCard key={p.id} product={p} onElapsed={refreshDeals} />
            ))}
          </div>
        </section>
      )}

      {!filtering && (upcoming.data ?? []).length > 0 && (
        <section aria-labelledby="coming-up">
          <h2 id="coming-up" className="mb-5 text-2xl font-extrabold">
            Coming up
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.data.map((p) => (
              <Link key={p.id} to={`/products/${p.id}`} className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4 transition hover:bg-white">
                <ProductImage src={p.images[0]} alt="" className="h-20 w-20 shrink-0 rounded-xl" />
                <div className="min-w-0">
                  <h3 className="truncate font-bold">{p.name}</h3>
                  <p className="text-sm text-slate-600">
                    <span className="font-bold text-brand">{formatPrice(p.flashSale.salePrice)}</span> from {formatDateTime(p.flashSale.startsAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="catalog" ref={catalogRef} className="scroll-mt-24" aria-labelledby="catalog-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="catalog-title" className="text-2xl font-extrabold">
              {q ? `Results for “${q}”` : category || 'All products'}
            </h2>
            {products.data && <p className="text-sm text-slate-500">{products.data.totalElements} items</p>}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm font-medium text-slate-600">
              Sort by
            </label>
            <select id="sort" className={`${inputClass} w-auto`} value={sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div role="group" aria-label="Filter by category" className="mb-6 flex flex-wrap gap-2">
          {['', ...(categories.data ?? [])].map((c) => {
            const active = category === c
            return (
              <button
                key={c || 'all'}
                aria-pressed={active}
                onClick={() => update({ category: c })}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active ? 'border-navy bg-navy text-white' : 'border-line bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {c || 'All'}
              </button>
            )
          })}
        </div>

        {products.error && <ErrorNotice error={products.error} onRetry={products.reload} />}
        {!products.error && !products.data && <Spinner />}

        {!products.error && products.data && rows.length === 0 && (
          <div className="rounded-2xl border border-line bg-white">
            <EmptyState
              title="No products found"
              action={
                filtering && (
                  <button className="font-semibold text-brand hover:underline" onClick={() => setParams({}, { replace: true })}>
                    Clear search and filters
                  </button>
                )
              }
            >
              {filtering ? 'Try a different search or category.' : 'Products will show up here once they are added.'}
            </EmptyState>
          </div>
        )}

        {rows.length > 0 && (
          <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${products.loading ? 'opacity-60' : ''}`}>
            {rows.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {products.data && (
          <Pagination page={products.data.page} totalPages={products.data.totalPages} totalElements={products.data.totalElements} size={PAGE_SIZE} onPage={(p) => update({ page: p })} />
        )}
      </section>
    </div>
  )
}
