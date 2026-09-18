import {
  Bell,
  Menu,
  Search,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

function AdminHeader({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">

      {/* Left */}
      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open admin menu"
        >
          <Menu size={21} />
        </button>

        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:w-48"
          />
        </div>

        <div className="sm:hidden">
          <h1 className="text-lg font-bold text-slate-900">
            Admin Panel
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-3">

        <button
          type="button"
          className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl p-1.5 pr-2 transition hover:bg-slate-100"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <User size={18} />
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-xs font-bold text-slate-900">
              Admin
            </p>

            <p className="text-[10px] text-slate-500">
              Administrator
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default AdminHeader;