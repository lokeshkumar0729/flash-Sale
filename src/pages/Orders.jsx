import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useQuery } from '../hooks/useQuery'
import { formatDate, formatPrice } from '../lib/format'
import ProductImage from '../components/product/ProductImage'
import EmptyState from '../components/ui/EmptyState'
import ErrorNotice from '../components/ui/ErrorNotice'
import OrderStatusBadge from '../components/ui/OrderStatusBadge'
import Pagination from '../components/ui/Pagination'
import Spinner from '../components/ui/Spinner'
import { primaryButton } from '../components/ui/styles'

const PAGE_SIZE = 5

export default function Orders() {
  const [page, setPage] = useState(0)
  const orders = useQuery(() => api.orders.list({ page, size: PAGE_SIZE }), [page])

  if (orders.error && !orders.data) return <ErrorNotice error={orders.error} onRetry={orders.reload} />
  if (!orders.data) return <Spinner />

  const rows = orders.data.content

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold">My orders</h1>
      {rows.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white">
          <EmptyState title="No orders yet" action={<Link to="/" className={primaryButton}>Start shopping</Link>}>
            When you place an order, you can track it here.
          </EmptyState>
        </div>
      ) : (
        <ul className={`space-y-4 ${orders.loading ? 'opacity-60' : ''}`}>
          {rows.map((o) => (
            <li key={o.id}>
              <Link to={`/orders/${o.id}`} className="block rounded-2xl border border-line bg-white p-5 transition hover:shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display font-bold">{o.orderNumber}</p>
                    <p className="text-sm text-slate-500">Placed {formatDate(o.createdAt)}</p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex -space-x-3">
                    {o.items.slice(0, 4).map((item) => (
                      <ProductImage key={item.productId} src={item.image} alt={item.name} className="h-12 w-12 rounded-xl border-2 border-white" />
                    ))}
                    {o.items.length > 4 && (
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-white bg-slate-100 text-xs font-bold">+{o.items.length - 4}</span>
                    )}
                  </div>
                  <p className="flex items-center gap-1 font-display text-lg font-extrabold tabular-nums">
                    {formatPrice(o.total)} <ChevronRight className="h-5 w-5 text-slate-400" />
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pagination page={orders.data.page} totalPages={orders.data.totalPages} totalElements={orders.data.totalElements} size={PAGE_SIZE} onPage={setPage} />
    </div>
  )
}
