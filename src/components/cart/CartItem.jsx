import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

function CartItem({ item }) {
  const {
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 py-5 sm:flex-row">
      
      {/* Product Image */}
      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={item.images[0]}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-medium text-indigo-600">
            {item.category}
          </p>

          <h3 className="text-base font-semibold text-slate-900">
            {item.name}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Quantity */}
          <div className="flex items-center rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity - 1
                )
              }
              className="p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-10 text-center text-sm font-semibold text-slate-800">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity + 1
                )
              }
              className="p-2 text-slate-600 transition hover:bg-slate-100"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">
              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
            </p>

            <p className="text-xs text-slate-400 line-through">
              ₹
              {(
                item.originalPrice * item.quantity
              ).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Remove */}
          <button
            type="button"
            onClick={() => removeFromCart(item.id)}
            className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition hover:text-red-600"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;