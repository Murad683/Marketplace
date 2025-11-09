import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Tailwind üçün minimal ikon paket

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-800 transition"
      title="Toggle theme"
    >
      {isDark ? (
        <Sun size={18} className="text-yellow-400" />
      ) : (
        <Moon size={18} className="text-gray-700" />
      )}
    </button>
  );
}