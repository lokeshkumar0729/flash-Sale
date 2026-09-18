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
        price: product.price ?? "",
        originalPrice: product.originalPrice ?? "",
        stock: product.stock ?? "",
        rating: product.rating ?? 4.5,
        reviews: product.reviews ?? 0,
        description: product.description || "",
        image: product.images?.[0] || "",
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

  const handleClose = (event) => {
    event.preventDefault();
    event.stopPropagation();

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
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
            onMouseDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close product form"
          >
            <X size={21} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Product Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Category + Stock */}
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
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Kitchen">
                  Home & Kitchen
                </option>
                <option value="Accessories">Accessories</option>
                <option value="Beauty">Beauty</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Selling Price
              </label>

              <input
                type="number"
                name="price"
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
                type="number"
                name="originalPrice"
                min="0"
                value={formData.originalPrice}
                onChange={handleChange}
                required
                placeholder="₹0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Image URL
            </label>

            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Description */}
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

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              onClick={handleClose}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
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