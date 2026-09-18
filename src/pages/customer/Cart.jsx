import {
  ArrowLeft,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/layout/Navbar";
import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";
import EmptyCart from "../../components/cart/EmptyCart";

import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    cartItems,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <Link
                to="/"
                className="transition hover:text-indigo-600"
              >
                Home
              </Link>

              <span>/</span>

              <span className="text-slate-800">
                Cart
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShoppingBag
                size={26}
                className="text-indigo-600"
              />

              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Shopping Cart
              </h1>
            </div>
          </div>

          {cartItems.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-600"
            >
              <Trash2 size={16} />
              Clear Cart
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            
            {/* Cart Items */}
            <div className="rounded-2xl border border-slate-200 bg-white px-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 py-4">
                <h2 className="font-semibold text-slate-900">
                  Cart Items
                </h2>

                <span className="text-sm text-slate-500">
                  {cartItems.length}{" "}
                  {cartItems.length === 1
                    ? "product"
                    : "products"}
                </span>
              </div>

              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}

              <div className="py-5">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  <ArrowLeft size={16} />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <CartSummary />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;