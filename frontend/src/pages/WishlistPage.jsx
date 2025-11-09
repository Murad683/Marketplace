// src/pages/WishlistPage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getWishlist, removeFromWishlist, productPhotoUrl } from "../api";
import { Link } from "react-router-dom";

export default function WishlistPage() {
  const { auth, isCustomer } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getWishlist(auth);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCustomer) load();
  }, [isCustomer]);

  const onRemove = async (pid) => {
    try {
      await removeFromWishlist(pid, auth);
      await load();
    } catch (e) {
      alert("Remove failed: " + e.message);
    }
  };

  if (!isCustomer) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-500 bg-white border rounded-xl p-8 shadow">
        Only customers can view wishlist.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">My Wishlist</h1>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">No items in wishlist.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {items.map((p) => {
            const img =
              p.photoIds && p.photoIds.length > 0
                ? productPhotoUrl(p.id, p.photoIds[0])
                : null;

            return (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              >
                <Link to={`/product/${p.id}`} className="block">
                  <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                    {img ? (
                      <img
                        src={img}
                        alt={p.name}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm">No image</div>
                    )}
                  </div>
                </Link>

                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-1">{p.categoryName}</div>
                  <Link
                    to={`/product/${p.id}`}
                    className="block font-medium text-gray-800 line-clamp-2"
                  >
                    {p.name}
                  </Link>
                  <div className="text-blue-600 font-semibold mt-1">${p.price}</div>

                  <div className="flex items-center gap-2 mt-3">
                    <Link
                      to={`/product/${p.id}`}
                      className="flex-1 text-center text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1.5"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => onRemove(p.id)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}