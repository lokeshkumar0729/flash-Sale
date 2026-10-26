import { api } from '../../api/client'
import { useQuery } from '../../hooks/useQuery'
import { formatDate, formatPrice } from '../../lib/format'
import ErrorNotice from '../../components/ui/ErrorNotice'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import Spinner from '../../components/ui/Spinner'

function Stat({ label, value, tone = '' }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-1.5 font-display text-3xl font-extrabold tabular-nums ${tone}`}>{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const stats = useQuery(() => api.admin.stats(), [])

  if (stats.error && !stats.data) return <ErrorNotice error={stats.error} onRetry={stats.reload} />
  if (!stats.data) return <Spinner />

  const s = stats.data
  const peak = Math.max(1, ...s.last7Days.map((d) => Number(d.revenue)))

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        <Stat label="Revenue (excl. cancelled)" value={formatPrice(s.revenue)} />
        <Stat label="Orders" value={s.orders} />
        <Stat label="Customers" value={s.customers} />
        <Stat label="Live flash sales" value={s.liveFlashSales} tone={s.liveFlashSales ? 'text-brand' : ''} />
        <Stat label="Active products" value={s.activeProducts} />
        <Stat label="Low stock (under 10)" value={s.lowStockProducts} tone={s.lowStockProducts ? 'text-brand' : ''} />
      </div>

      <section className="rounded-2xl border border-line bg-white p-6" aria-labelledby="week">
        <h2 id="week" className="mb-6 text-lg font-bold">Revenue, last 7 days</h2>
        <ul className="flex h-48 items-end gap-3">
          {s.last7Days.map((d) => {
            const height = Math.max(Number(d.revenue) > 0 ? 6 : 2, (Number(d.revenue) / peak) * 100)
            return (
              <li key={d.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2" title={`${d.orders} orders`}>
                <span className="text-xs font-semibold tabular-nums text-slate-600">{Number(d.revenue) > 0 ? formatPrice(d.revenue) : ''}</span>
                <div className="w-full rounded-t-lg bg-brand" style={{ height: `${height}%` }} role="img" aria-label={`${formatDate(d.date)}: ${formatPrice(d.revenue)}`} />
                <span className="text-xs text-slate-500">{new Date(`${d.date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'short' })}</span>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-line bg-white" aria-labelledby="recent">
        <h2 id="recent" className="border-b border-line px-6 py-4 text-lg font-bold">Recent orders</h2>
        {s.recentOrders.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {s.recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-6 py-3 font-semibold">{o.orderNumber}</td>
                    <td className="px-6 py-3">{o.customerName}</td>
                    <td className="px-6 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-6 py-3 text-right font-semibold tabular-nums">{formatPrice(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
