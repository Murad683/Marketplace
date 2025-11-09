import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMerchantOrders, updateOrderStatus } from "../api";

// Xəritə: backend enum -> ekranda göstərilən label
const STATUS_OPTIONS = [
  { value: "CREATED", label: "CREATED" },
  { value: "ACCEPTED", label: "ACCEPTED" },
  { value: "REJECT_BY_MERCHANT", label: "REJECT BY MERCHANT" },
  { value: "REJECT_BY_CUSTOMER", label: "REJECT BY CUSTOMER" },
  { value: "DELIVERED", label: "DELIVERED" },
];

function OrderRow({ order, onUpdate, saving }) {
  const [status, setStatus] = useState(order.status);
  const [reason, setReason] = useState(order.rejectReason || "");

  const handleSave = () => {
    onUpdate(order.orderId, status, reason);
  };

  const needsReason = status === "REJECT_BY_MERCHANT"; // sadə məntiq

  return (
    <li className="p-4 flex flex-col gap-4 border-b last:border-b-0 lg:flex-row lg:items-start lg:justify-between">
      {/* ORDER INFO */}
      <div className="flex-1">
        <div className="font-medium text-gray-800">{order.productName}</div>
        <div className="text-sm text-gray-500">
          Count: {order.count} | Total: ${order.totalAmount}
        </div>
        <div className="text-xs text-gray-400">Created: {order.createdAt}</div>

        {order.rejectReason && (
          <div className="text-xs text-red-500 mt-1">
            Prev Reason: {order.rejectReason}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex-1 flex flex-col gap-2 max-w-sm">
        <label className="text-xs font-medium text-gray-600">
          Status
        </label>
        <select
          className="border rounded-md px-2 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
          Reject Reason
          <span className="text-[10px] text-gray-400">
            (only when rejecting)
          </span>
        </label>
        <input
          className="border rounded-md px-2 py-2 text-sm"
          placeholder="Reason if rejected"
          disabled={!needsReason}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          disabled={saving}
          onClick={handleSave}
          className={`rounded-md text-sm font-medium px-4 py-2 text-white ${
            saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </li>
  );
}

export default function MerchantOrdersPage() {
  const { auth, isMerchant } = useAuth();
  const [orders, setOrders] = useState([]);
  const [savingId, setSavingId] = useState(null);

  const load = () => {
    getMerchantOrders(auth)
      .then(setOrders)
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    if (isMerchant) load();
  }, [isMerchant]);

  const handleUpdate = async (orderId, status, rejectReason) => {
    try {
      setSavingId(orderId);

      // PATCH /merchant/orders/{orderId}/status
      // body: { status: "...", rejectReason: "..." }
      await updateOrderStatus(
        orderId,
        { status, rejectReason },
        auth
      );

      load();
    } catch (err) {
      alert("Failed to update order: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  if (!isMerchant) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-500 bg-white border rounded-xl p-8 shadow">
        Only merchants can view orders.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Incoming Orders
      </h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 p-8">
            You have no orders yet.
          </div>
        ) : (
          <ul>
            {orders.map((o) => (
              <OrderRow
                key={o.orderId}
                order={o}
                saving={savingId === o.orderId}
                onUpdate={handleUpdate}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}