import {
  BarChart3,
  Box,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Logo from "../common/Logo";
import { useAuth } from "../../context/AuthContext";

function AdminSidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/admin/products",
      icon: Box,
    },
    {
      label: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Analytics",
      path: "/admin/analytics",
      icon: BarChart3,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-950 text-white">

      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <Logo dark />

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Admin Label */}
      <div className="px-5 pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex-1 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              (item.path !== "/admin" &&
                location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/40"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/10" />

        {/* Settings */}
        <Link
          to="/admin/settings"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
            location.pathname === "/admin/settings"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Settings size={19} />
          <span>Settings</span>
        </Link>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl bg-white/5 p-3">
          <p className="text-xs font-semibold text-white">
            Admin Panel
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            FlashSale Management
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default AdminSidebar;