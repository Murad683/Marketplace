import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../auth";
import { loginRequest } from "../api";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await loginRequest({
        username: form.username.trim(),
        password: form.password,
      });

      saveAuth({
        token: data.token,
        tokenType: data.tokenType,
        username: data.username || form.username,
        type: data.type || "CUSTOMER",
      });

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-semibold mb-2 text-center text-gray-900">
        Welcome back
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Please sign in to continue.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <div className="flex gap-2">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="shrink-0 rounded-lg border border-gray-300 px-3 text-xs text-gray-700 hover:bg-gray-50"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            submitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}