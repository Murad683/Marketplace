// src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { productPhotoUrl } from "../api";

export default function ProductCard({ product, size = "md", isNew }) {
  const firstId =
    product?.photoIds && product.photoIds.length > 0 ? product.photoIds[0] : null;

  const sizeMap = {
    sm: { aspect: "aspect-[4/3]", bodyMinH: "min-h-[110px]" },
    md: { aspect: "aspect-[4/3]", bodyMinH: "min-h-[120px]" },
    lg: { aspect: "aspect-[16/10]", bodyMinH: "min-h-[140px]" },
  };
  const S = sizeMap[size] || sizeMap.md;

  const lowStock = (product?.stockCount ?? 0) > 0 && product.stockCount <= 5;

  const computedIsNew = (() => {
    if (typeof isNew === "boolean") return isNew;
    const raw = product?.createdAt;
    if (!raw) return false;
    const ts = Date.parse(
      typeof raw === "string" && raw.includes(" ") && !raw.includes("T")
        ? raw.replace(" ", "T")
        : raw
    );
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts < 24 * 60 * 60 * 1000;
  })();

  // ➕ format YYYY-MM-DD (il-ay-gün)
  const createdDateStr = (() => {
    const raw = product?.createdAt;
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
    <article
      aria-label={product?.name}
      className="
        group relative h-full rounded-2xl p-[1px]
        bg-gradient-to-br from-slate-200/90 via-white to-slate-100
        dark:from-zinc-700/60 dark:via-zinc-800 dark:to-zinc-900
        shadow-[0_8px_30px_rgba(0,0,0,.06)] hover:shadow-[0_14px_44px_rgba(0,0,0,.14)]
        transition-all duration-300
      "
    >
      <div
        className="
          relative flex h-full flex-col overflow-hidden rounded-2xl
          bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl
          border border-white/60 dark:border-white/10
        "
      >
        {/* IMAGE (clickable) */}
        <Link
          to={`/product/${product?.id}`}
          aria-label={`Open ${product?.name}`}
          className="relative block"
        >
          <div className={`${S.aspect} w-full overflow-hidden`}>
            {firstId ? (
              <img
                src={productPhotoUrl(product.id, firstId)}
                alt={product?.name || "Product image"}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* badges */}
          <div className="pointer-events-none absolute left-3 top-3 flex gap-2">
            {computedIsNew && (
              <span className="rounded-full bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold shadow-sm backdrop-blur">
                New
              </span>
            )}
            {lowStock && (
              <span className="rounded-full bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold shadow-sm backdrop-blur">
                Low stock
              </span>
            )}
          </div>

          {/* overlay name + price */}
          <div className="absolute inset-x-3 bottom-1 sm:bottom-2">
            <div className="mx-auto flex items-center justify-between gap-3 rounded-xl border border-white/50 dark:border-white/10 bg-white/80 dark:bg-zinc-900/70 px-4 py-2 shadow-sm backdrop-blur">
              <h3 className="line-clamp-1 text-[15px] font-semibold text-gray-900 dark:text-zinc-100" title={product?.name}>
                {product?.name}
              </h3>
              <div
                className="shrink-0 rounded-md bg-gradient-to-tr from-indigo-500/15 to-blue-500/15 text-[13px] font-semibold text-blue-700 dark:text-blue-300 px-2 py-1"
                aria-label={`Price ${product?.price} dollars`}
              >
                ${Number(product?.price ?? 0).toFixed(2)}
              </div>
            </div>
          </div>
        </Link>

        {/* BODY */}
        <div className={`flex flex-1 flex-col gap-2 px-4 pb-4 pt-3 ${S.bodyMinH}`}>
          <p className="line-clamp-2 text-[13px] leading-5 text-gray-600 dark:text-zinc-400">
            {product?.details}
          </p>

          {/* Added date (il-ay-gün) */}
          {createdDateStr && (
            <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-zinc-400">
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 2a1 1 0 100 2h8a1 1 0 100-2H6zM4 6a2 2 0 00-2 2v6a4 4 0 004 4h8a4 4 0 004-4V8a2 2 0 00-2-2H4zm1 3h10v7a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" />
              </svg>
              <span>Added: {createdDateStr}</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span
              title={product?.categoryName}
              className="rounded-md border border-gray-200/70 dark:border-white/10 bg-gray-50/70 dark:bg-white/5 px-2 py-0.5 text-[12px] text-gray-600 dark:text-zinc-300"
            >
              {product?.categoryName}
            </span>

            <Link
              to={`/product/${product?.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:from-indigo-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
              aria-label={`View details of ${product?.name}`}
            >
              View
              <svg className="h-4 w-4 opacity-90" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L12 6.414V16a1 1 0 11-2 0V6.414L6.707 9.707A1 1 0 015.293 8.293l5-5z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-indigo-400/0 group-hover:ring-2 group-hover:ring-indigo-400/40 transition-all duration-300" />
    </article>
  );
}