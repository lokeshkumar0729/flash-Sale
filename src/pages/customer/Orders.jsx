import { Link } from "react-router-dom";
import { ArrowLeft, PackageOpen, ShoppingBag } from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import OrderCard from "../../components/order/OrderCard";
import { useOrders } from "../../context/OrderContext";

function Orders() {
  const { orders } = useOrders();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <PackageOpen size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                My Orders
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track and manage your orders
              </p>
            </div>
          </div>
        </div>

        {/* Orders */}
        {orders.length > 0 ? (
          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ShoppingBag size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              You haven't placed any orders yet. Start
              shopping and your orders will appear here.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;