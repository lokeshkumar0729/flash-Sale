import { useState } from "react";
import { useCart } from "../../context/CartContext";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import Logo from "../../components/common/Logo";
import products from "../../data/products";

function ProductDetails() {
  const { addToCart, cartCount } = useCart();
  const { productId } = useParams();
const {
  isInWishlist,
  toggleWishlist,
} = useWishlist();
  const product = products.find(
    (item) => item.id === Number(productId)
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Product Not Found
          </h1>

          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-indigo-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((value) => value + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((value) => value - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center px-4 lg:px-6">
          <Link to="/">
            <Logo />
          </Link>

          <div className="ml-auto flex items-center gap-4">
           <Link
  to="/cart"
  className="
    relative
    rounded-lg
    p-2.5
    text-slate-600
    transition
    hover:bg-slate-100
    hover:text-indigo-600
  "
>
  <ShoppingCart size={21} />

  {cartCount > 0 && (
    <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
      {cartCount}
    </span>
  )}
</Link>

            <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
              <ShieldCheck size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
          <Link
            to="/"
            className="hover:text-indigo-600"
          >
            Home
          </Link>

          <span>/</span>

          <span>{product.category}</span>

          <span>/</span>

          <span className="font-medium text-slate-700">
            {product.name}
          </span>
        </div>

        {/* Back */}
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>

        {/* Product */}
        <div className="grid gap-8 lg:grid-cols-2">

          {/* LEFT — Images */}
          <div>

            {/* Main image */}
            <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-8 sm:h-[500px]">

              {discount > 0 && (
                <span className="absolute left-5 top-5 z-10 rounded-md bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
                  {discount}% OFF
                </span>
              )}

              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-contain transition duration-300"
              />

              {/* Previous */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage - 1 + product.images.length) %
                          product.images.length
                      )
                    }
                    className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md text-slate-600 hover:text-indigo-600"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  {/* Next */}
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage + 1) %
                          product.images.length
                      )
                    }
                    className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md text-slate-600 hover:text-indigo-600"
                  >
                    <ChevronRight size={19} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    flex
                    h-20
                    w-20
                    flex-shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-lg
                    border
                    bg-slate-50
                    p-2
                    ${
                      selectedImage === index
                        ? "border-indigo-500 ring-2 ring-indigo-100"
                        : "border-slate-200"
                    }
                  `}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Details */}
          <div className="flex flex-col">

            {/* Category */}
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-1">
                <Star
                  size={15}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="text-sm font-semibold text-slate-700">
                  {product.rating}
                </span>
              </div>

              <span className="text-sm text-slate-500">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-slate-200" />

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-slate-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              <span className="text-base text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>

              {discount > 0 && (
                <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-600">
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-7 text-slate-600">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-semibold text-emerald-600">
                In Stock
              </span>

              <span className="text-xs text-slate-400">
                ({product.stock} items available)
              </span>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-slate-700">
                Quantity
              </p>

              <div className="flex w-fit items-center overflow-hidden rounded-lg border border-slate-200">
                <button
                  onClick={decreaseQuantity}
                  className="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-50"
                >
                  <Minus size={16} />
                </button>

                <span className="flex h-10 w-12 items-center justify-center border-x border-slate-200 text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  className="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <button
               onClick={() => {
  addToCart(product, quantity);
}}
                className="flex items-center justify-center gap-2 rounded-lg border border-indigo-600 bg-white px-5 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                onClick={() =>
                  alert("Buy Now will be connected to Checkout later.")
                }
                className="rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-violet-700"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist */}
         <button
  type="button"
  onClick={() => toggleWishlist(product)}
  className={`mt-3 flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition ${
    isInWishlist(product.id)
      ? "border-pink-200 bg-pink-50 text-pink-500"
      : "border-slate-200 bg-white text-slate-500 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-500"
  }`}
>
  <Heart
    size={17}
    className={
      isInWishlist(product.id)
        ? "fill-pink-500 text-pink-500"
        : ""
    }
  />

  {isInWishlist(product.id)
    ? "Remove from Wishlist"
    : "Add to Wishlist"}
</button>

            {/* Benefits */}
            <div className="mt-7 grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3">

              <div className="flex items-center gap-3">
                <Truck
                  size={19}
                  className="text-indigo-600"
                />

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Free Shipping
                  </p>

                  <p className="text-[10px] text-slate-400">
                    On eligible orders
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw
                  size={19}
                  className="text-indigo-600"
                />

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    7 Days Return
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Easy returns
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={19}
                  className="text-indigo-600"
                />

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    1 Year Warranty
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Genuine product
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Features */}
        <section className="mt-12 border-t border-slate-200 pt-8">

          <h2 className="text-xl font-bold text-slate-900">
            Product Features
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
              >
                ✓ {feature}
              </div>
            ))}
          </div>

        </section>

      </main>
    </div>
  );
}

export default ProductDetails;