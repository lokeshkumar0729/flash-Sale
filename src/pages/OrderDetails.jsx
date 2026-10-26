import { useState } from 'react'
import { ArrowLeft, Check, PartyPopper } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useToast } from '../context/toast-context'
import { useQuery } from '../hooks/useQuery'
import { formatDateTime, formatPrice } from '../lib/format'
import { ORDER_FLOW, ORDER_STATUS, PAYMENT_LABEL } from '../lib/orderStatus'
import ProductImage from '../components/product/ProductImage'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import ErrorNotice from '../components/ui/ErrorNotice'
import OrderStatusBadge from '../components/ui/OrderStatusBadge'
import Spinner from '../components/ui/Spinner'
import { primaryButton, secondaryButton } from '../components/ui/styles'

function Timeline({ status }) {
  const current = ORDER_FLOW.indexOf(status)
  return (
    <ol className="grid grid-cols-5 gap-2" aria-label="Order progress">
      {ORDER_FLOW.map((step, i) => {
        const done = i <= current
        return (
          <li key={step} className="flex flex-col items-center gap-2 text-center" aria-current={i === current ? 'step' : undefined}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-ok text-white' : 'bg-slate-200 text-slate-500'}`}>
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </span>
            <span className={`text-xs font-semibold leading-tight ${done ? 'text-ink' : 'text-slate-400'}`}>{ORDER_STATUS[step].label}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default function OrderDetails() {
  const { id } = useParams()
  const location = useLocation()
  const toast = useToast()
  const order = useQuery(() => api.orders.get(id), [id])
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  if (order.error?.status === 404) {
    return <EmptyState title="Order not found" action={<Link to="/orders" className={primaryButton}>My orders</Link>} />
  }
  if (order.error && !order.data) return <ErrorNotice error={order.error} onRetry={order.reload} />
  if (!order.data) return <Spinner />

  const o = order.data
  const cancelled = o.status === 'CANCELLED'

  const cancel = async () => {
    setBusy(true)
    try {
      await api.orders.cancel(o.id)
      toast.success('Order cancelled. The items went back into stock.')
      setConfirming(false)
      order.reload()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <Link to="/orders" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> My orders
      </Link>

      {location.state?.placed && (
        <p role="status" className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-semibold text-emerald-800">
          <PartyPopper className="h-5 w-5" /> Order placed. Thank you for shopping with FlashSale!
        </p>
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">{o.orderNumber}</h1>
          <p className="text-sm text-slate-500">Placed {formatDateTime(o.createdAt)}</p>
        </div>
        <OrderStatusBadge status={o.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-6" aria-label="Status">
            {cancelled ? <p className="font-semibold text-red-700">This order was cancelled.</p> : <Timeline status={o.status} />}
          </section>

          <section className="rounded-2xl border border-line bg-white" aria-labelledby="items">
            <h2 id="items" className="border-b border-line px-6 py-4 text-lg font-bold">
              Items
            </h2>
            <ul className="divide-y divide-line">
              {o.items.map((item) => (
                <li key={item.productId} className="flex items-center gap-4 px-6 py-4">
                  <ProductImage src={item.image} alt="" className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <Link to={`/products/${item.productId}`} className="line-clamp-1 font-semibold hover:underline">{item.name}</Link>
                    <p className="text-sm text-slate-500">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                      {item.flashPrice && <span className="ml-2 rounded-md bg-brand-soft px-1.5 py-0.5 text-xs font-bold text-brand">Flash price</span>}
                    </p>
                  </div>
                  <p className="font-bold tabular-nums">{formatPrice(Number(item.unitPrice) * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-6" aria-labelledby="payment">
            <h2 id="payment" className="mb-3 text-lg font-bold">Payment summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd className="tabular-nums">{formatPrice(o.subtotal)}</dd></div>
              {Number(o.savings) > 0 && <div className="flex justify-between text-ok"><dt>You saved</dt><dd className="tabular-nums">{formatPrice(o.savings)}</dd></div>}
              <div className="flex justify-between"><dt className="text-slate-600">Delivery</dt><dd className="tabular-nums">{Number(o.deliveryCharge) === 0 ? 'Free' : formatPrice(o.deliveryCharge)}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-lg font-bold"><dt>Total</dt><dd className="font-display tabular-nums">{formatPrice(o.total)}</dd></div>
              <div className="flex justify-between pt-1"><dt className="text-slate-600">Method</dt><dd>{PAYMENT_LABEL[o.paymentMethod]}</dd></div>
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-white p-6" aria-labelledby="ship">
            <h2 id="ship" className="mb-3 text-lg font-bold">Delivering to</h2>
            <address className="space-y-0.5 text-sm not-italic text-slate-600">
              <p className="font-semibold text-ink">{o.address.fullName}</p>
              <p>{o.address.addressLine}</p>
              <p>{o.address.city}, {o.address.state} {o.address.pincode}</p>
              <p>{o.address.phone}</p>
            </address>
          </section>

          {o.cancellable && (
            <button className={`${secondaryButton} w-full`} onClick={() => setConfirming(true)}>
              Cancel order
            </button>
          )}
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Cancel this order?"
          message="The items go back into stock and any flash-deal units are released. You cannot undo this."
          confirmLabel="Cancel order"
          busy={busy}
          onConfirm={cancel}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  )
}
