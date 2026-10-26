import { ORDER_STATUS } from '../../lib/orderStatus'

export default function OrderStatusBadge({ status }) {
  const meta = ORDER_STATUS[status]
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>{meta.label}</span>
}
