import ProductCard from "./ProductCard";
import products from "../../data/products";

function ProductGrid() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Deals of the Day
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Grab these deals before they're gone.
          </p>
        </div>

        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;