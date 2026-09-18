import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShieldCheck,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import OrderStatus from "../../components/order/OrderStatus";
import { useOrders } from "../../context/OrderContext";

function OrderDetails() {
  const { orderId } = useParams();
  const { getOrderById } = useOrders();

  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <Package
              size={48}
              className="mx-auto text-slate-300"
            />

            <h1 className="mt-5 text-xl font-bold text-slate-900">
              Order not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              The order you're looking for doesn't exist.
            </p>

            <Link
              to="/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* Header */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Order Details
              </p>

              <h1 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                #{order.id}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Placed on {order.date}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={18}
                className="text-green-500"
              />

              <span className="text-sm font-semibold text-green-600">
                {order.status.replaceAll("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Package size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Order Status
              </h2>

              <p className="text-xs text-slate-500">
                Track your order progress
              </p>
            </div>
          </div>

          <OrderStatus status={order.status} />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Products */}
          <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Ordered Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {order.items.length} item
                {order.items.length !== 1 ? "s" : ""} in
                this order
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-5 sm:p-6"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-24">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.category}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right column */}
          <div className="space-y-6">
            {/* Price Summary */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Price Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-900">
                    ₹
                    {order.subtotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Discount
                  </span>

                  <span className="font-medium text-green-600">
                    -₹
                    {order.savings.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">
                    Delivery
                  </span>

                  <span className="font-medium text-slate-900">
                    {order.deliveryCharge === 0
                      ? "FREE"
                      : `₹${order.deliveryCharge.toLocaleString(
                          "en-IN"
                        )}`}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">
                      Total
                    </span>

                    <span className="text-lg font-extrabold text-indigo-600">
                      ₹
                      {order.total.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Payment Method
                  </h2>

                  <p className="mt-1 text-sm font-medium uppercase text-indigo-600">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Address */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <MapPin size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Delivery Address
              </h2>

              <p className="text-xs text-slate-500">
                Shipping destination
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">
              {order.address.fullName}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {order.address.address}
              <br />
              {order.address.city},{" "}
              {order.address.state} -{" "}
              {order.address.pincode}
              <br />
              {order.address.country}
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>
                Phone: {order.address.phone}
              </span>

              <span>
                Email: {order.address.email}
              </span>
            </div>
          </div>
        </section>

        {/* Security */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
          <ShieldCheck size={16} />
          Your order information is securely stored.
        </div>
      </main>
    </div>
  );
}

export default OrderDetails;