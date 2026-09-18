import { Link } from "react-router-dom";
import { ChevronRight, Package } from "lucide-react";

import OrderStatus from "./OrderStatus";

function OrderCard({ order }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Order ID
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            #{order.id}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
            {order.status.replaceAll("_", " ")}
          </span>

          <span className="text-xs text-slate-400">
            {order.date}
          </span>
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4 p-5">
        {order.items.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4"
          >
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {item.name}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Quantity: {item.quantity}
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}

        {order.items.length > 2 && (
          <p className="text-xs font-medium text-slate-500">
            + {order.items.length - 2} more item(s)
          </p>
        )}
      </div>

      {/* Status */}
      <div className="border-t border-slate-100 px-5 py-6">
        <OrderStatus status={order.status} />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500">
            Total Amount
          </p>

          <p className="mt-1 text-lg font-extrabold text-slate-900">
            ₹{order.total.toLocaleString("en-IN")}
          </p>
        </div>

        <Link
          to={`/orders/${order.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          View Details
          <ChevronRight size={17} />
        </Link>
      </div>
    </div>
  );
}

export default OrderCard;