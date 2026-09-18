import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
function ProductCard({ product }) {
  const {
  isInWishlist,
  toggleWishlist,
} = useWishlist();
  const { addToCart } = useCart();
  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0;

  return (
    <article className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Discount */}
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
          {discount}% OFF
        </span>
      )}

      {/* Wishlist */}
      <button
        type="button"
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-slate-400 transition hover:text-red-500"
        onClick={(event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleWishlist(product);
}}
      >
        <Heart
  size={18}
  className={
    isInWishlist(product.id)
      ? "fill-pink-500 text-pink-500"
      : "text-slate-500"
  }
/>
      </button>

      {/* Product */}
      <Link to={`/products/${product.id}`}>

        {/* Image */}
        <div className="flex h-44 items-center justify-center bg-slate-50 p-5">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </div>

        {/* Details */}
        <div className="p-4">

          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {product.category}
          </p>

          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-800">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            <Star
              size={13}
              className="fill-yellow-400 text-yellow-400"
            />

            <span className="text-xs font-medium text-slate-600">
              {product.rating}
            </span>

            <span className="text-[10px] text-slate-400">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Stock */}
          <p className="mt-2 text-[11px] font-medium text-emerald-600">
            {product.stock} in stock
          </p>

          {/* Cart button */}
          <button
            type="button"
          onClick={(event) => {
  event.preventDefault();
  event.stopPropagation();

  addToCart(product, 1);
}}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>

        </div>
      </Link>
    </article>
  );
}

export default ProductCard;