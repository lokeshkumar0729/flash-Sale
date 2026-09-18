import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyProduct = {
  name: "",
  category: "Electronics",
  price: "",
  originalPrice: "",
  stock: "",
  rating: 4.5,
  reviews: 0,
  description: "",
  image: "",
};

function ProductForm({ product, onClose, onSave }) {
  const [formData, setFormData] = useState(emptyProduct);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "Electronics",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        stock: product.stock || "",
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        description: product.description || "",
        image: product.images?.[0] || product.image || "",
      });
    } else {
      setFormData(emptyProduct);
    }
  }, [product]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedProduct = {
      ...formData,
      id: product?.id,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      stock: Number(formData.stock),
      rating: Number(formData.rating),
      reviews: Number(formData.reviews),
      images: formData.image ? [formData.image] : [],
      features: product?.features || [],
    };

    onSave(formattedProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {product ? "Edit Product" : "Add Product"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {product
                ? "Update product information"
                : "Add a new product to FlashSale"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Kitchen</option>
                <option>Accessories</option>
                <option>Beauty</option>
                <option>Sports</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Stock
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Selling Price
              </label>

              <input
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="₹0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Original Price
              </label>

              <input
                name="originalPrice"
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={handleChange}
                required
                placeholder="₹0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Image URL
            </label>

            <input
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter product description"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;