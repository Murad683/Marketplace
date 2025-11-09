import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { getCart, deleteCartItem, createOrders } from "../api";

export default function CartPage() {
  const { auth, isCustomer } = useAuth();
  const [items, setItems] = useState([]);

  const load = () => {
    getCart(auth)
      .then(setItems)
      .catch(() => setItems([]));
  };

  useEffect(() => {
    if (isCustomer) load();
  }, [isCustomer]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + (it.totalPrice || 0), 0),
    [items]
  );

  const handleDelete = async (itemId) => {
    await deleteCartItem(itemId, auth);
    load();
  };

  const handleCheckout = async () => {
    try {
      await createOrders(auth);
      alert("Checkout successful!");
      load();
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  if (!isCustomer) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-500 bg-white border rounded-xl p-8 shadow">
        Only customers can view cart.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Cart</h1>
        <div className="text-sm text-gray-500">{items.length} items</div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {items.length === 0 ? (
          <div className="p-8 text-gray-500 text-center">Cart is empty.</div>
        ) : (
          <ul className="divide-y">
            {items.map((it) => (
              <li
                key={it.itemId}
                className="flex items-start justify-between gap-4 p-4"
              >
                <div>
                  <div className="font-medium text-gray-800">
                    {it.productName}
                  </div>
                  <div className="text-sm text-gray-500">
                    Count: {it.count}
                  </div>
                  <div className="text-sm text-gray-500">
                    Unit: ${it.pricePerUnit}
                  </div>
                  <div className="text-sm font-semibold text-blue-600">
                    Total: ${it.totalPrice}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(it.itemId)}
                  className="text-red-500 text-sm border border-red-300 rounded-md px-2 py-1 hover:bg-red-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-lg font-semibold text-gray-800">
            Grand Total: ${total}
          </div>

          <button
            disabled={items.length === 0}
            onClick={handleCheckout}
            className={`rounded-md text-sm font-medium px-4 py-2 ${
              items.length === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}