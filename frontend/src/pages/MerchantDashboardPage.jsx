import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function MerchantDashboardPage() {
  const { isMerchant } = useAuth();

  if (!isMerchant) {
    return (
      <div className="max-w-md mx-auto mt-10 text-center text-gray-500 bg-white border rounded-xl p-8 shadow">
        Only merchants can view this page.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Merchant Dashboard
      </h1>

      <div className="bg-white border rounded-xl shadow-sm divide-y">
        <Link
          to="/merchant/create-product"
          className="block p-5 hover:bg-gray-50"
        >
          <div className="font-medium text-gray-800">Create Product</div>
          <div className="text-sm text-gray-500">
            Add a new product to the marketplace and upload photos.
          </div>
        </Link>

        <Link
          to="/merchant/orders"
          className="block p-5 hover:bg-gray-50"
        >
          <div className="font-medium text-gray-800">View Orders</div>
          <div className="text-sm text-gray-500">
            See and update incoming orders for your products.
          </div>
        </Link>
      </div>
    </div>
  );
}