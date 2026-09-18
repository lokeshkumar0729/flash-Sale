import { useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import AdminLayout from "../../components/admin/AdminLayout";
import ProductTable from "../../components/admin/ProductTable";
import ProductForm from "../../components/admin/ProductForm";
import initialProducts from "../../data/products";

function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        products.map((product) => product.category)
      ),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // -----------------------------
  // OPEN ADD PRODUCT
  // -----------------------------
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // -----------------------------
  // OPEN EDIT PRODUCT
  // -----------------------------
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // -----------------------------
  // CLOSE FORM
  // -----------------------------
 const handleCloseForm = () => {
  setEditingProduct(null);
  setShowForm(false);
};

  // -----------------------------
  // SAVE PRODUCT
  // -----------------------------
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                ...productData,
              }
            : product
        )
      );
    } else {
      setProducts((currentProducts) => [
        {
          ...productData,
          id: Date.now(),
        },
        ...currentProducts,
      ]);
    }

    handleCloseForm();
  };

  // -----------------------------
  // DELETE PRODUCT
  // -----------------------------
  const handleDeleteProduct = (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== productId
      )
    );
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <Package size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Products
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your FlashSale product catalog.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={19} />
            Add Product
          </button>
        </div>

        {/* FILTERS */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">

            {/* SEARCH */}
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* CATEGORY */}
            <div className="flex items-center gap-3">
              <SlidersHorizontal
                size={18}
                className="text-slate-400"
              />

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-56"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? "All Categories"
                      : item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* COUNT */}
        <div>
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {products.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* PRODUCT TABLE */}
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      {/* PRODUCT FORM MODAL */}
    {showForm && (
  <ProductForm
    product={editingProduct}
    onClose={handleCloseForm}
    onSave={handleSaveProduct}
  />
)}
    </AdminLayout>
  );
}

export default AdminProducts;