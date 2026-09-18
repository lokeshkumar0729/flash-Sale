import {
  Monitor,
  Shirt,
  Home,
  Watch,
  Sparkles,
  Dumbbell,
} from "lucide-react";

const categories = [
  {
    name: "Electronics",
    icon: Monitor,
  },
  {
    name: "Fashion",
    icon: Shirt,
  },
  {
    name: "Home",
    icon: Home,
  },
  {
    name: "Accessories",
    icon: Watch,
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

function CategoryList() {
  return (
    <section>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Categories
        </h2>

        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          View All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">

        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              key={category.name}
              className="
                group
                flex
                flex-col
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                transition
                hover:-translate-y-0.5
                hover:border-indigo-200
                hover:shadow-sm
              "
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Icon size={19} />
              </div>

              <span className="text-xs font-medium text-slate-600">
                {category.name}
              </span>
            </button>
          );
        })}

      </div>
    </section>
  );
}

export default CategoryList;