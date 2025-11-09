import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../auth";
import { registerRequest } from "../api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    surname: "",
    type: "CUSTOMER",
    companyName: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
        name: form.name.trim(),
        surname: form.surname.trim(),
        type: form.type,
        companyName: form.type === "MERCHANT" ? form.companyName.trim() : "",
      };
      const data = await registerRequest(payload);

      saveAuth({
        token: data.token,
        tokenType: data.tokenType,
        username: data.username || payload.username,
        type: data.type || payload.type,
      });
      navigate("/");
      window.location.reload();
    } catch (err) {
      setError("Registration failed. Please check fields and try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-semibold mb-2 text-gray-900 text-center">
        Create your account
      </h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        It takes less than a minute.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Surname
            </label>
            <input
              name="surname"
              value={form.surname}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Surname"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Username
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Username"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Password
          </label>
          <div className="flex gap-2">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
              required
              minLength={5}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Account Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="MERCHANT">Merchant</option>
            </select>
          </div>

          {form.type === "MERCHANT" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Company Name
              </label>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Your company"
                required
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            submitting ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Creating…" : "Register"}
        </button>
      </form>
    </div>
  );
}