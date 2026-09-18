import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import Navbar from "../../components/layout/Navbar";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function Wishlist() {
  const {
    wishlistItems,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                <Heart size={21} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  My Wishlist
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  {wishlistCount}{" "}
                  {wishlistCount === 1 ? "product" : "products"} saved
                </p>
              </div>
            </div>
          </div>

          {wishlistCount > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={17} />
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-500">
              <Heart size={38} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Save products you love and come back to them
              whenever you want.
            </p>

            <Link
              to="/home"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore Products
            </Link>
          </section>
        ) : (
          /* Wishlist Grid */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => {
              const discount = Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              );

              return (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    {/* Discount */}
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                      {discount}% OFF
                    </span>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm transition hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                      {product.category}
                    </p>

                    <Link
                      to={`/products/${product.id}`}
                      className="mt-1 block"
                    >
                      <h2 className="line-clamp-2 min-h-12 text-base font-bold text-slate-900 transition group-hover:text-indigo-600">
                        {product.name}
                      </h2>
                    </Link>

                    {/* Price */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-lg font-extrabold text-slate-900">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>

                      <span className="text-sm text-slate-400 line-through">
                        ₹
                        {product.originalPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>

                    {/* Cart */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                    >
                      <ShoppingCart size={17} />
                      Add to Cart
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;