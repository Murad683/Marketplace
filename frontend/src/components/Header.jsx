// src/components/Header.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

export default function Header() {
  const { isLoggedIn, isCustomer, isMerchant, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white border-b border-gray-200 text-gray-800 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
        {/* Left: Logo / Home link */}
        <Link
          to="/"
          className="text-lg font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Marketplace
        </Link>

        {/* Right: Nav */}
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium">
          {!isLoggedIn && (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
              >
                Register
              </Link>
            </>
          )}

          {isCustomer && (
            <>
              <Link
                to="/wishlist"
                className="text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
              >
                Wishlist
              </Link>
              <Link
                to="/cart"
                className="text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
              >
                Cart
              </Link>
              <Link
                to="/orders"
                className="text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
              >
                My Orders
              </Link>
            </>
          )}

          {isMerchant && (
            <>
              <Link
                to="/merchant/create-product"
                className="text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
              >
                Create Product
              </Link>
              <Link
                to="/merchant/orders"
                className="text-gray-700 hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400 transition-colors"
              >
                Orders
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors"
            >
              Logout
            </button>
          )}

          {/* THEME TOGGLE BUTTON */}
          <button
            onClick={toggleTheme}
            className="ml-3 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors
                       dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
          >
            {isDark ? "Light mode ☀" : "Dark mode 🌙"}
          </button>
        </nav>
      </div>
    </header>
  );
}