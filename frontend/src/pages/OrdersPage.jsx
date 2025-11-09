// src/pages/OrdersPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getOrders, createOrders, cancelOrder } from "../api";

export default function OrdersPage() {
  const { auth, isCustomer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // UI states: reason text + “expanded” (input açıq?) per order
  const [reasons, setReasons] = useState({});     // { [orderId]: string }
  const [expanded, setExpanded] = useState({});   // { [orderId]: boolean }

  const load = () => {
    setLoading(true);
    getOrders(auth)
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isCustomer) load();
  }, [isCustomer]);

  const handleCheckout = async () => {
    try {
      await createOrders(auth);
      load();
      alert("Checkout successful, orders created!");
    } catch (err) {
      alert("Checkout failed: " + err.message);
    }
  };

  const openCancel = (orderId) =>
    setExpanded((s) => ({ ...s, [orderId]: true }));

  const closeCancel = (orderId) =>
    setExpanded((s) => ({ ...s, [orderId]: false }));

  const onCancel = async (orderId) => {
    const reason = (reasons[orderId] || "").trim();
    if (!reason) {
      alert("Please write a reason to cancel.");
      return;
    }
    try {
      await cancelOrder(orderId, reason, auth);
      setReasons((r) => ({ ...r, [orderId]: "" }));
      closeCancel(orderId);
      load();
      alert("Order cancelled.");
    } catch (err) {
      alert("Cancel failed: " + err.message);
    }
  };

  if (!isCustomer) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-500 bg-white border rounded-2xl p-8 shadow-sm">
        Only customers can view orders.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-gray-500">Orders created from your cart</p>
        </div>

        <button
          onClick={handleCheckout}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          Checkout (Create new Order)
        </button>
      </div>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            You have no orders yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {orders.map((o) => (
              <OrderRow
                key={o.orderId}
                order={o}
                reason={reasons[o.orderId] || ""}
                setReason={(v) =>
                  setReasons((r) => ({ ...r, [o.orderId]: v }))
                }
                expanded={!!expanded[o.orderId]}
                onOpen={() => openCancel(o.orderId)}
                onClose={() => closeCancel(o.orderId)}
                onConfirm={() => onCancel(o.orderId)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function OrderRow({ order, reason, setReason, expanded, onOpen, onClose, onConfirm }) {
  const canCancel = useMemo(() => {
    return (
      order.status !== "DELIVERED" &&
      order.status !== "REJECT_BY_CUSTOMER" &&
      order.status !== "REJECT_BY_MERCHANT"
    );
  }, [order.status]);

  return (
    <li className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        {/* LEFT: info */}
        <div className="min-w-0">
          <div className="flex items-start gap-3">
            <h3 className="font-medium text-gray-900 truncate">
              {order.productName}
            </h3>
            <StatusPill status={order.status} />
          </div>

          <div className="mt-1 text-sm text-gray-600">
            <span className="mr-4">
              Count: <b className="text-gray-800">{order.count}</b>
            </span>
            <span>
              Total: <b className="text-gray-800">{formatCurrency(order.totalAmount)}</b>
            </span>
          </div>

          <div className="mt-1 text-xs text-gray-400">
            Placed: {formatDate(order.createdAt)}
          </div>

          {!!order.rejectReason && (
            <div className="mt-2 text-xs text-red-600">
              Reason: {order.rejectReason}
            </div>
          )}
        </div>

        {/* RIGHT: Cancel flow */}
        <div className="w-full lg:w-96">
          {canCancel ? (
            !expanded ? (
              <button
                onClick={onOpen}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel order
              </button>
            ) : (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="text-xs font-medium text-amber-800 mb-2">
                  Please provide a reason to cancel:
                </div>
                <input
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Reason to cancel…"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onConfirm();
                    if (e.key === "Escape") onClose();
                  }}
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={onConfirm}
                    disabled={!reason.trim()}
                    className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-white shadow-sm ${
                      reason.trim()
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500/40"
                        : "bg-red-300 cursor-not-allowed"
                    } focus:outline-none focus:ring-2`}
                  >
                    Confirm cancel
                  </button>
                  <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  >
                    Keep order
                  </button>
                </div>
                <div className="mt-1 text-[11px] text-amber-700/80">
                  Tip: Press <b>Enter</b> to confirm or <b>Esc</b> to close.
                </div>
              </div>
            )
          ) : (
            <div className="text-sm text-gray-500">This order can’t be cancelled.</div>
          )}
        </div>
      </div>
    </li>
  );
}

function StatusPill({ status }) {
  const { bg, text } = statusColors(status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${bg} ${text} ring-1 ring-inset ring-black/5`}
      title={status}
    >
      {labelForStatus(status)}
    </span>
  );
}

/* ---------- Utils ---------- */

function formatCurrency(n) {
  if (typeof n !== "number") return n;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function formatDate(isoLike) {
  try {
    const d = new Date(isoLike);
    return d.toLocaleString();
  } catch {
    return isoLike;
  }
}

function statusColors(status) {
  switch (status) {
    case "CREATED":
      return { bg: "bg-gray-100", text: "text-gray-700" };
    case "ACCEPTED":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "DELIVERED":
      return { bg: "bg-emerald-100", text: "text-emerald-700" };
    case "REJECT_BY_CUSTOMER":
      return { bg: "bg-amber-100", text: "text-amber-700" };
    case "REJECT_BY_MERCHANT":
      return { bg: "bg-rose-100", text: "text-rose-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
}

function labelForStatus(s) {
  switch (s) {
    case "CREATED":
      return "Created";
    case "ACCEPTED":
      return "Accepted";
    case "DELIVERED":
      return "Delivered";
    case "REJECT_BY_CUSTOMER":
      return "Cancelled by you";
    case "REJECT_BY_MERCHANT":
      return "Rejected by merchant";
    default:
      return s;
  }
}