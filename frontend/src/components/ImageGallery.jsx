import { useEffect, useState, useCallback } from "react";

export default function ImageGallery({ productId, photoIds = [] }) {
  const [idx, setIdx] = useState(0);

  const hasImages = photoIds.length > 0;

  const next = useCallback(
    () => setIdx((i) => (i + 1) % Math.max(photoIds.length, 1)),
    [photoIds.length]
  );
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + Math.max(photoIds.length, 1)) % Math.max(photoIds.length, 1)),
    [photoIds.length]
  );

  // Klaviatura oxları
  useEffect(() => {
    function onKey(e) {
      if (!hasImages) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasImages, next, prev]);

  if (!hasImages) {
    return (
      <div className="w-full h-80 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/60 flex items-center justify-center text-gray-400 dark:text-zinc-500">
        No image
      </div>
    );
  }

  const mainSrc = `http://localhost:8080/products/${productId}/photos/${photoIds[idx]}`;

  return (
    <div className="space-y-3">
      {/* Main image + arrows */}
      <div className="relative">
        <img
          src={mainSrc}
          alt="product"
          className="w-full h-80 object-cover rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
        />

        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 px-2 py-1 text-gray-700 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800"
          aria-label="Previous image"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 px-2 py-1 text-gray-700 dark:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800"
          aria-label="Next image"
        >
          ›
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {photoIds.map((pid, i) => {
          const src = `http://localhost:8080/products/${productId}/photos/${pid}`;
          const active = i === idx;
          return (
            <button
              key={pid}
              onClick={() => setIdx(i)}
              className={`relative rounded-lg overflow-hidden border ${
                active
                  ? "border-blue-500 ring-2 ring-blue-300"
                  : "border-gray-200 dark:border-zinc-700"
              }`}
            >
              <img
                src={src}
                alt={`thumb-${i}`}
                className="w-full h-20 object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}