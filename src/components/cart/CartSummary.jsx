import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function CartSummary() {
  const navigate = useNavigate();

  const {
    subtotal,
    savings,
    deliveryCharge,
    total,
  } = useCart();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        Order Summary
      </h2>

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

        <div className="border-t border-slate-200 pt-4">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-slate-900">
              Total
            </span>

            <span className="text-xl font-bold text-indigo-600">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/checkout")}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-md"
      >
        Proceed to Checkout
        <ArrowRight size={17} />
      </button>

      <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-3">
          <Truck
            size={18}
            className="text-indigo-600"
          />

          <span className="text-xs text-slate-500">
            Free delivery on orders above ₹999
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ShieldCheck
            size={18}
            className="text-emerald-600"
          />

          <span className="text-xs text-slate-500">
            Secure and protected checkout
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;