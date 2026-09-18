import {
  ArrowRight,
  LockKeyhole,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

function CheckoutSummary({ onPlaceOrder }) {
  const {
    cartItems,
    subtotal,
    savings,
    deliveryCharge,
    total,
  } = useCart();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <ShoppingBag
            size={20}
            className="text-indigo-600"
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Order Summary
          </h2>

          <p className="text-xs text-slate-500">
            {cartItems.length}{" "}
            {cartItems.length === 1
              ? "product"
              : "products"}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="mt-5 max-h-64 space-y-4 overflow-y-auto border-b border-slate-200 pb-5">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
              <img
                src={item.images[0]}
                alt={item.name}
                className="h-full w-full object-cover"
              />

              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900/80 px-1 text-[10px] font-bold text-white">
                {item.quantity}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {item.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                ₹{item.price.toLocaleString("en-IN")} ×{" "}
                {item.quantity}
              </p>
            </div>

            <p className="text-sm font-semibold text-slate-800">
              ₹
              {(item.price * item.quantity).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">
            Subtotal
          </span>

          <span className="font-medium text-slate-800">
            ₹{subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Discount
          </span>

          <span className="font-medium text-emerald-600">
            -₹{savings.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-slate-500">
            Delivery
          </span>

          <span className="font-medium text-slate-800">
            {deliveryCharge === 0
              ? "FREE"
              : `₹${deliveryCharge}`}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-slate-900">
            Total
          </span>

          <span className="text-xl font-bold text-indigo-600">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Place Order */}
      <button
        type="button"
        onClick={onPlaceOrder}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-md"
      >
        Place Order
        <ArrowRight size={17} />
      </button>

      {/* Security */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <LockKeyhole
          size={14}
          className="text-emerald-600"
        />

        Secure checkout
      </div>
    </div>
  );
}

export default CheckoutSummary;