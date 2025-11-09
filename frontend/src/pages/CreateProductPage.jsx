import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getCategories,
  createCategory,
  createProduct,
  getProductById,
  uploadProductPhoto,
} from "../api";

export default function CreateProductPage() {
  const { auth, isMerchant } = useAuth();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    details: "",
    price: "",
    stockCount: "",
  });

  const [newCategoryName, setNewCategoryName] = useState("");

  const [createdProduct, setCreatedProduct] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);

  const loadCategories = () => {
    getCategories().then(setCategories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const p = await createProduct(
        {
          categoryId: Number(form.categoryId),
          name: form.name,
          details: form.details,
          price: Number(form.price),
          stockCount: Number(form.stockCount),
        },
        auth
      );
      setCreatedProduct(p);
      setPreviewProduct(p);
      alert("Product created! Now upload photos below.");
    } catch (err) {
      alert("Create product failed: " + err.message);
    }
  };

  const handleFileChange = async (e) => {
    if (!createdProduct) return;

    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // birdən çox şəkil upload edək (ardıcıl)
    for (const file of files) {
      try {
        await uploadProductPhoto(createdProduct.id, file, auth);
      } catch (err) {
        alert("Photo upload failed for one file: " + err.message);
      }
    }

    // şəkillər yenilənsin
    const refreshed = await getProductById(createdProduct.id);
    setPreviewProduct(refreshed);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
    try {
      await createCategory(newCategoryName.trim(), auth);
      setNewCategoryName("");
      loadCategories(); // siyahını yenilə
      alert("Category added.");
    } catch (err) {
      alert("Failed to create category: " + err.message);
    }
  };

  if (!isMerchant) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-500 bg-white border rounded-xl p-8 shadow">
        Only merchants can create products.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 grid gap-10 lg:grid-cols-2">
      {/* LEFT: create product form + create category */}
      <div className="space-y-8">
        {/* product create card */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h1 className="text-xl font-semibold text-gray-800 mb-4">
            Create Product
          </h1>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Category
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm"
                required
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Name
              </label>
              <input
                name="name"
                className="w-full border rounded-md px-3 py-2 text-sm"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-medium block mb-1">
                Details
              </label>
              <textarea
                name="details"
                className="w-full border rounded-md px-3 py-2 text-sm h-24"
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-700 font-medium block mb-1">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-700 font-medium block mb-1">
                  Stock Count
                </label>
                <input
                  name="stockCount"
                  type="number"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-700"
              type="submit"
            >
              Create
            </button>
          </form>
        </div>

        {/* category create card */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Add New Category
          </h2>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-md px-3 py-2 text-sm"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-black whitespace-nowrap"
            >
              Add
            </button>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            This calls POST /categories and refreshes the dropdown above.
          </p>
        </div>
      </div>

      {/* RIGHT: photo upload + live preview */}
      <div className="bg-white border rounded-xl shadow-sm p-6 h-fit">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Photos & Preview
        </h2>

        {!createdProduct ? (
          <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-md p-6 text-center">
            After you create the product, you can upload photos here.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="text-sm text-gray-700 font-medium block mb-2">
                Upload product photos
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700"
              />
              <p className="text-xs text-gray-400 mt-1">
                You can select multiple files. Each one is sent to
                POST /products/{`{productId}`}/photos
              </p>
            </div>

            {previewProduct && (
              <div className="border rounded-lg p-4">
                <div className="font-medium text-gray-800">
                  {previewProduct.name}
                </div>
                <div className="text-sm text-blue-600 font-semibold">
                  ${previewProduct.price}
                </div>
                <div className="text-xs text-gray-500">
                  Stock: {previewProduct.stockCount}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  {previewProduct.photoIds?.length ? (
                    previewProduct.photoIds.map((pid) => (
                      <img
                        key={pid}
                        src={`http://localhost:8080/products/${previewProduct.id}/photos/${pid}`}
                        alt={previewProduct.name}
                        className="rounded border h-24 w-full object-cover"
                      />
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm col-span-2 text-center border border-dashed border-gray-300 rounded-md py-6">
                      No photos yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}