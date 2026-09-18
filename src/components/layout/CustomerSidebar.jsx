import {
  LayoutGrid,
  Monitor,
  Shirt,
  Home,
  BriefcaseBusiness,
  Sparkles,
  Dumbbell,
  X,
} from "lucide-react";

const categories = [
  {
    name: "All Categories",
    icon: LayoutGrid,
  },
  {
    name: "Electronics",
    icon: Monitor,
  },
  {
    name: "Fashion",
    icon: Shirt,
  },
  {
    name: "Home & Kitchen",
    icon: Home,
  },
  {
    name: "Accessories",
    icon: BriefcaseBusiness,
  },
  {
    name: "Beauty",
    icon: Sparkles,
  },
  {
    name: "Sports",
    icon: Dumbbell,
  },
];

function CustomerSidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-16
          z-50
          h-[calc(100vh-4rem)]
          w-64
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          lg:sticky
          lg:top-16
          lg:z-30
          lg:block
          lg:translate-x-0
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Mobile Close */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 lg:hidden">
          <span className="text-sm font-semibold text-slate-800">
            Categories
          </span>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">

          <h2 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Categories
          </h2>

          <nav className="space-y-1">
            {categories.map((category, index) => {
              const Icon = category.icon;
              const active = index === 0;

              return (
                <button
                  key={category.name}
                  className={`
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    transition
                    ${
                      active
                        ? "bg-indigo-50 font-semibold text-indigo-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                    }
                  `}
                >
                  <Icon size={17} />

                  <span>{category.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default CustomerSidebar;