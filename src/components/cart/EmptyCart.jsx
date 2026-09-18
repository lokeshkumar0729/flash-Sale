import {
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function EmptyCart() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
        <ShoppingCart
          size={38}
          className="text-indigo-600"
        />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        Your cart is empty
      </h2>

      <p className="mt-2 max-w-md text-sm text-slate-500">
        Looks like you haven't added anything to your
        cart yet. Explore our products and find
        something you love.
      </p>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="mt-6 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        <ArrowLeft size={17} />
        Continue Shopping
      </button>
    </div>
  );
}

export default EmptyCart;