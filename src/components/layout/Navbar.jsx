import {
  Search,
  ShoppingCart,
  UserRound,
  Menu,
} from "lucide-react";

import Logo from "../common/Logo";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Navbar({ onMenuClick }) {
  const { cartCount } = useCart();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-6">

        {/* Mobile Menu */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Logo */}
        <Logo />

        {/* Search */}
        <div className="mx-auto hidden max-w-xl flex-1 md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="
                w-full
                rounded-lg
                border
                border-slate-200
                bg-slate-50
                py-2
                pl-4
                pr-11
                text-sm
                outline-none
                transition
                focus:border-indigo-500
                focus:bg-white
                focus:ring-2
                focus:ring-indigo-100
              "
            />

            <button className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-slate-500 hover:text-indigo-600">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">

         {/* Cart */}
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

          {/* Profile */}
         <Link
  to="/profile"
  className="
    rounded-lg
    p-2.5
    text-slate-600
    transition
    hover:bg-slate-100
    hover:text-indigo-600
  "
>
  <UserRound size={21} />
</Link>

        </div>
      </div>
    </header>
  );
}

export default Navbar;