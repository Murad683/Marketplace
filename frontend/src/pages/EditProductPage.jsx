import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  getProductById,
  getCategories,
  updateProduct,
  deleteProduct,
} from "../api";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, isMerchant } = useAuth();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryId: "",
    name: "",
    details: "",
    price: "",
    stockCount: "",
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!isMerchant) return;
    getCategories().then(setCategories);

    getProductById(id).then((p) => {
      setForm({
        categoryId: p.categoryId,
        name: p.name,
        details: p.details,
        price: p.price,
        stockCount: p.stockCount,
      });
      setLoaded(true);
    });
  }, [id, isMerchant]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  if (!isMerchant) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-500 bg-white border rounded-xl p-8 shadow">
        Only merchants can edit products.
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(
        id,
        {
          categoryId: Number(form.categoryId),
          name: form.name,
          details: form.details,
          price: Number(form.price),
          stockCount: Number(form.stockCount),
        },
        auth
      );
      alert("Product updated!");
    } catch (err) {
      console.error(err);
      alert("Update failed: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure? This will permanently remove the product (if allowed)."
      )
    )
      return;

    try {
      await deleteProduct(id, auth);
      alert("Product deleted");
      navigate("/");
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);

      // err.message bu anda backend-dən gələn string JSON ola bilər.
      // Məs: {"status":500,"error":"...violates foreign key constraint..."}
      // Biz ora baxaq:

      let niceMessage = "Delete failed.";

      try {
        const parsed = JSON.parse(err.message);

        if (parsed.status === 403) {
          niceMessage =
            "You cannot delete this product. You are not allowed to delete it.";
        } else if (
          parsed.status === 500 &&
          typeof parsed.error === "string" &&
          parsed.error.includes("violates foreign key constraint")
        ) {
          niceMessage =
            "This product already has orders in the system. Products that are part of orders cannot be deleted.";
        } else if (parsed.error) {
          // fallback to backend error field
          niceMessage = parsed.error;
        }
      } catch (jsonErr) {
        // err.message parse olunmadısa, normal text kimi göstər
        niceMessage = err.message;
      }

      alert(niceMessage);
    }
  };

  if (!loaded) {
    return (
      <div className="text-center py-12 text-gray-500">Loading product...</div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Edit Product
          </h1>
          <button
            onClick={handleDelete}
            className="text-red-600 text-sm border border-red-300 rounded-md px-2 py-1 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
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
              value={form.name}
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
              value={form.details}
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
                value={form.price}
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
                value={form.stockCount}
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
            Save Changes
          </button>

          <div className="text-[11px] text-gray-500 text-center mt-4 leading-relaxed">
            You cannot delete a product that already appears in customer
            orders. This is normal business logic so that order history
            remains valid.
          </div>
        </form>
      </div>
    </div>
  );
}