export const ORDER_FLOW = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED']

export const ORDER_STATUS = {
  PLACED: { label: 'Order placed', badge: 'bg-slate-100 text-slate-700' },
  CONFIRMED: { label: 'Confirmed', badge: 'bg-sky-100 text-sky-800' },
  SHIPPED: { label: 'Shipped', badge: 'bg-indigo-100 text-indigo-800' },
  OUT_FOR_DELIVERY: { label: 'Out for delivery', badge: 'bg-amber-100 text-amber-800' },
  DELIVERED: { label: 'Delivered', badge: 'bg-emerald-100 text-emerald-800' },
  CANCELLED: { label: 'Cancelled', badge: 'bg-red-100 text-red-800' },
}

// What an admin may do next (mirrors OrderStatus.canTransitionTo on the server).
export const NEXT_STATUS = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export const PAYMENT_LABEL = { UPI: 'UPI', CARD: 'Credit / debit card', NETBANKING: 'Net banking', COD: 'Cash on delivery' }
