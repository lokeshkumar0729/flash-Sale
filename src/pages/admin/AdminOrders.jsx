import { useState } from 'react'
import { api } from '../../api/client'
import { useToast } from '../../context/toast-context'
import { useQuery } from '../../hooks/useQuery'
import { formatDateTime, formatPrice } from '../../lib/format'
import { NEXT_STATUS, ORDER_STATUS, PAYMENT_LABEL } from '../../lib/orderStatus'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import EmptyState from '../../components/ui/EmptyState'
import ErrorNotice from '../../components/ui/ErrorNotice'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import Pagination from '../../components/ui/Pagination'
import { inputClass, primaryButton, secondaryButton } from '../../components/ui/styles'

const PAGE_SIZE = 10

const ACTION_LABEL = {
  CONFIRMED: 'Confirm',
  SHIPPED: 'Mark shipped',
  OUT_FOR_DELIVERY: 'Out for delivery',
  DELIVERED: 'Mark delivered',
  CANCELLED: 'Cancel order',
}

export default function AdminOrders() {
  const toast = useToast()
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(0)
  const [cancelling, setCancelling] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const orders = useQuery(() => api.admin.orders.list({ status, page, size: PAGE_SIZE }), [status, page])
  const rows = orders.data?.content ?? []

  const move = async (order, next) => {
    setBusyId(order.id)
    try {
      await api.admin.orders.updateStatus(order.id, next)
      toast.success(`${order.orderNumber} is now ${ORDER_STATUS[next].label.toLowerCase()}`)
      setCancelling(null)
      orders.reload()
    } catch (err) {
      toast.error(err.message)
      orders.reload() // another admin may have moved it already
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold">Orders</h1>
        <select aria-label="Filter by status" className={`${inputClass} w-auto`} value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }}>
          <option value="">All statuses</option>
          {Object.entries(ORDER_STATUS).map(([value, meta]) => (
            <option key={value} value={value}>{meta.label}</option>
          ))}
        </select>
      </div>

      {orders.error && <ErrorNotice error={orders.error} onRetry={orders.reload} />}

      {!orders.error && (
        <div className="overflow-hidden rounded-2xl border border-line bg-white" aria-busy={orders.loading}>
          {orders.data && rows.length === 0 ? (
            <EmptyState title={status ? 'No orders with this status' : 'No orders yet'} />
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full min-w-[56rem] text-left text-sm ${orders.loading ? 'opacity-60' : ''}`}>
                <thead className="border-b border-line bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Items</th>
                    <th className="px-4 py-3 text-right font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Next step</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((o) => (
                    <tr key={o.id} className="align-top">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{o.orderNumber}</p>
                        <p className="text-xs text-slate-500">{formatDateTime(o.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{o.customerName}</p>
                        <p className="text-xs text-slate-500">{o.address.city}, {o.address.state}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {o.items.map((i) => (
                          <p key={i.productId} className="line-clamp-1">{i.quantity} × {i.name}</p>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="font-bold tabular-nums">{formatPrice(o.total)}</p>
                        <p className="text-xs text-slate-500">{PAYMENT_LABEL[o.paymentMethod]}</p>
                      </td>
                      <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          {NEXT_STATUS[o.status].map((next) =>
                            next === 'CANCELLED' ? (
                              <button key={next} className={`${secondaryButton} px-3! py-1.5! text-red-600`} disabled={busyId === o.id} onClick={() => setCancelling(o)}>
                                {ACTION_LABEL[next]}
                              </button>
                            ) : (
                              <button key={next} className={`${primaryButton} px-3! py-1.5!`} disabled={busyId === o.id} onClick={() => move(o, next)}>
                                {ACTION_LABEL[next]}
                              </button>
                            ),
                          )}
                          {NEXT_STATUS[o.status].length === 0 && <span className="text-xs text-slate-400">Final</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {orders.data && <Pagination page={orders.data.page} totalPages={orders.data.totalPages} totalElements={orders.data.totalElements} size={PAGE_SIZE} onPage={setPage} />}

      {cancelling && (
        <ConfirmDialog
          title={`Cancel ${cancelling.orderNumber}?`}
          message="The items return to stock and any flash-deal units are released. This cannot be undone."
          confirmLabel="Cancel order"
          busy={busyId === cancelling.id}
          onConfirm={() => move(cancelling, 'CANCELLED')}
          onCancel={() => setCancelling(null)}
        />
      )}
    </div>
  )
}
