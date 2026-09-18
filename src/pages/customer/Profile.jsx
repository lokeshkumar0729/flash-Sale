import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  User,
  Heart,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Profile Header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 sm:h-36" />

          <div className="px-5 pb-6 sm:px-7">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shadow-md sm:h-28 sm:w-28">
                  <User size={42} strokeWidth={1.8} />
                </div>

                <div className="pb-1">
                  <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    {user?.name || "Customer"}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    {user?.role || "CUSTOMER"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <User size={20} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Personal Information
                </h2>

                <p className="text-xs text-slate-500">
                  Your account information
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <User size={16} />
                  <span className="text-xs font-medium">
                    Full Name
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user?.name || "Not available"}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail size={16} />
                  <span className="text-xs font-medium">
                    Email Address
                  </span>
                </div>

                <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                  {user?.email || "Not available"}
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone size={16} />
                  <span className="text-xs font-medium">
                    Phone Number
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {user?.phone || "Not available"}
                </p>
              </div>

              {/* Location */}
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin size={16} />
                  <span className="text-xs font-medium">
                    Location
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold text-slate-900">
                  India
                </p>
              </div>
            </div>
          </section>

          {/* Account */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="font-bold text-slate-900">
              Account
            </h2>

            <div className="mt-4 space-y-2">
              <Link
                to="/orders"
                className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Package size={19} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    My Orders
                  </p>

                  <p className="text-xs text-slate-500">
                    Track your orders
                  </p>
                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-400"
                />
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                  <Heart size={19} />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Wishlist
                  </p>

                  <p className="text-xs text-slate-500">
                    Saved products
                  </p>
                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-400"
                />
              </Link>
            </div>
          </section>
        </div>

        {/* Security */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Account Security
              </h2>

              <p className="text-xs text-slate-500">
                Your account is protected with secure authentication.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-700">
              Authentication enabled
            </p>

            <p className="mt-1 text-xs leading-5 text-green-600">
              Your authentication system will be connected
              to Spring Security and JWT when we build the
              backend.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;