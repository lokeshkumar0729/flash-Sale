import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useOrders } from "../../context/OrderContext";
import Navbar from "../../components/layout/Navbar";
import AddressForm from "../../components/checkout/AddressFormTemp";
import PaymentMethod from "../../components/checkout/PaymentMethod";
import CheckoutSummary from "../../components/checkout/CheckoutSummary";

import { useCart } from "../../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const {
  cartItems,
  subtotal,
  savings,
  deliveryCharge,
  total,
  clearCart,
} = useCart();

const { addOrder } = useOrders();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("upi");

  const [orderPlaced, setOrderPlaced] =
    useState(false);

 const handlePlaceOrder = () => {
  if (
    !address.fullName ||
    !address.phone ||
    !address.email ||
    !address.address ||
    !address.city ||
    !address.state ||
    !address.pincode ||
    !address.country
  ) {
    alert("Please fill in all delivery address details.");
    return;
  }

  const newOrder = addOrder({
    items: cartItems,
    address,
    paymentMethod,
    subtotal,
    savings,
    deliveryCharge,
    total,
  });

  console.log("Order placed:", newOrder);

  clearCart();

  setOrderPlaced(true);
};

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-4 py-10">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2
                size={44}
                className="text-emerald-600"
              />
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Order Placed Successfully!
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              Thank you for shopping with FlashSale.
              Your order has been placed successfully.
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <p>
                Payment Method:{" "}
                <span className="font-semibold uppercase text-slate-800">
                  {paymentMethod}
                </span>
              </p>

              <p className="mt-1">
                Delivery to:{" "}
                <span className="font-semibold text-slate-800">
                  {address.city}, {address.state}
                </span>
              </p>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Continue Shopping
              </button>

              <button
                type="button"
                onClick={() => navigate("/orders")}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                View Orders
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />

        <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Add some products before proceeding to
              checkout.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link
            to="/cart"
            className="transition hover:text-indigo-600"
          >
            Cart
          </Link>

          <span>/</span>

          <span className="text-slate-800">
            Checkout
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Complete your delivery and payment details.
          </p>
        </div>

        {/* Checkout Steps */}
        <div className="mb-7 flex items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
              <MapPin size={16} />
            </div>

            <span className="hidden text-sm font-semibold text-indigo-600 sm:block">
              Address
            </span>
          </div>

          <div className="mx-3 h-px flex-1 bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white">
              <CreditCard size={16} />
            </div>

            <span className="hidden text-sm font-semibold text-indigo-600 sm:block">
              Payment
            </span>
          </div>

          <div className="mx-3 h-px flex-1 bg-slate-200" />

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-500">
              3
            </div>

            <span className="hidden text-sm font-medium text-slate-500 sm:block">
              Confirmation
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <AddressForm
              address={address}
              setAddress={setAddress}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <CheckoutSummary
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;