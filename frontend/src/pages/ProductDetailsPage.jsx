import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getProductById,
  addToCart,
  addToWishlist,
  removeFromWishlist,
} from "../api";
import { useAuth } from "../hooks/useAuth";
import ImageGallery from "../components/ImageGallery";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth, isCustomer, isMerchant } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [wishLoading, setWishLoading] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await getProductById(id);
        setProduct(data);
        setQuantity(1);
        setIsInWishlist(false);
      } catch (e) {
        console.error(e);
        setErrorMsg("Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleAddToCart() {
    if (!product) return;
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const maxStock = product.stockCount ?? 0;
      if (maxStock === 0) {
        setErrorMsg("Out of stock.");
        return;
      }
      if (quantity < 1) {
        setErrorMsg("Quantity must be at least 1.");
        return;
      }
      if (quantity > maxStock) {
        setErrorMsg("Not enough stock for that quantity.");
        return;
      }
      await addToCart(product.id, quantity, auth);
      setSuccessMsg("Added to cart ✅");
    } catch (err) {
      console.error(err);
      setErrorMsg("Couldn't add to cart: " + err.message);
    }
  }

  async function handleWishlistToggle() {
    if (!product || !isCustomer) return;
    setWishLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id, auth);
        setIsInWishlist(false);
        setSuccessMsg("Removed from wishlist ❌");
      } else {
        await addToWishlist(product.id, auth);
        setIsInWishlist(true);
        setSuccessMsg("Added to wishlist ❤️");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Wishlist action failed: " + err.message);
    } finally {
      setWishLoading(false);
    }
  }

  if (loading) {
    return <div className="max-w-5xl mx-auto p-6">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-red-600">
        Could not find product.
      </div>
    );
  }

  // Added on: YYYY-MM-DD
  const addedStr = (() => {
    const raw = product.createdAt;
    if (!raw) return "";
    const ts = Date.parse(
      typeof raw === "string" && raw.includes(" ") && !raw.includes("T")
        ? raw.replace(" ", "T")
        : raw
    );
    if (Number.isNaN(ts)) return "";
    const d = new Date(ts);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-sm text-blue-600 mb-4">
        <button onClick={() => navigate(-1)} className="hover:underline">
          ← Back
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        {/* LEFT: images */}
        <div>
          <ImageGallery productId={product.id} photoIds={product.photoIds || []} />
        </div>

        {/* RIGHT: info */}
        <div className="flex flex-col">
          <div className="text-xs uppercase tracking-wide text-blue-600 font-semibold mb-2">
            {product.categoryName}
          </div>

          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

          {addedStr && (
            <div className="mb-3">
              <div className="inline-flex items-center gap-2 text-xs text-gray-500 border rounded-full px-3 py-1">
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                  <path d="M6 2a1 1 0 100 2h8a1 1 0 100-2H6zM4 6a2 2 0 00-2 2v6a4 4 0 004 4h8a4 4 0 004-4V8a2 2 0 00-2-2H4zm1 3h10v7a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" />
                </svg>
                Added: {addedStr}
              </div>
            </div>
          )}

          <div className="text-sm leading-relaxed mb-4 text-gray-600">
            {product.details}
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <div className="text-2xl font-semibold">${product.price}</div>
            <div className="text-sm text-gray-500">
              Stock:{" "}
              <span
                className={
                  product.stockCount > 0
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {product.stockCount > 0
                  ? `${product.stockCount} available`
                  : "Out of stock"}
              </span>
            </div>
          </div>

          {/* 👉 CLICKABLE MERCHANT */}
          <div className="text-sm text-gray-500 mb-6">
            Sold by:{" "}
            <Link
              to={`/merchant/${product.merchantId}`}
              className="font-medium text-blue-600 hover:underline"
              aria-label={`View all products by ${product.merchantCompanyName}`}
            >
              {product.merchantCompanyName}
            </Link>
          </div>

          {/** CUSTOMER actions */}
          {isCustomer && (
            <div className="space-y-4 mb-8">
              <div>
                <div className="text-xs text-gray-500 mb-2 font-medium">
                  Quantity
                </div>
                <div className="flex items-center gap-4">
                  <button
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-40"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="min-w-[3rem] text-center font-semibold">
                    {quantity}
                  </div>
                  <button
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-40"
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(product.stockCount ?? 1, q + 1)
                      )
                    }
                    disabled={quantity >= (product.stockCount ?? 1)}
                  >
                    +
                  </button>
                  <div className="text-xs text-gray-500">
                    In stock: {product.stockCount}
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={(product.stockCount ?? 0) === 0 || quantity < 1}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button
                className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold px-4 py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={wishLoading}
                onClick={handleWishlistToggle}
              >
                {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist ❤️"}
              </button>
            </div>
          )}

          {isMerchant && (
            <div className="mb-8">
              <Link
                to={`/merchant/edit-product/${product.id}`}
                className="inline-block bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg"
              >
                Edit Product
              </Link>
            </div>
          )}

          {errorMsg && <div className="text-red-600 text-sm mb-2">{errorMsg}</div>}
          {successMsg && (
            <div className="text-green-600 text-sm mb-2">{successMsg}</div>
          )}
        </div>
      </div>
    </div>
  );
}