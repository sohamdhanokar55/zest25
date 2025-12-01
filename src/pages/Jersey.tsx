import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  createOrder,
  loadRazorpay,
  RazorpaySuccessResponse,
} from "../utils/razorpay";

const Jersey = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [jerseyNumber, setJerseyNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");

  const JERSEY_PRICE = 300;
  const totalAmount = JERSEY_PRICE;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !department || !semester || !jerseyNumber) {
      alert("Please fill in all required fields");
      return;
    }

    const jerseyNum = parseInt(jerseyNumber);
    if (isNaN(jerseyNum) || jerseyNum < 1 || jerseyNum > 999) {
      alert("Please enter a valid jersey number (1-999)");
      return;
    }

    try {
      await loadRazorpay();
      const order = await createOrder(totalAmount);
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!key) {
        throw new Error("Razorpay key is not configured");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "Zest Jersey Purchase",
        description: `Jersey Purchase - Number ${jerseyNumber} - ${department}`,
        order_id: order.order_id,
        handler: (response: RazorpaySuccessResponse) => {
          alert("Payment successful! Your jersey order is confirmed.");
          console.log("Razorpay payment successful", response);
          // Reset form
          setName("");
          setJerseyNumber("");
          setDepartment("");
          setSemester("");
        },
        theme: {
          color: "#f97316",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Failed to initialize payment", error);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="text-6xl">👕</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Purchase Jersey</h1>
                  <p className="text-lg opacity-90">
                    Official Zest 2025 Jersey
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 m-6 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Important Notice
                  </h3>
                  <p className="text-yellow-700">
                    If you already have the jersey of year 2024–25, you DO NOT
                    need to buy another. Only purchase again if it is lost or no
                    longer fits.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePayment} className="p-8">
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Number on Jersey */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number on Jersey *
                  </label>
                  <input
                    type="text"
                    value={jerseyNumber}
                    onChange={(e) =>
                      setJerseyNumber(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter jersey number (1-999)"
                    // maxLength="3"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Department</option>
                    <option value="AN/TE">AN/TE</option>
                    <option value="ME">ME</option>
                    <option value="AE">AE</option>
                    <option value="CE">CE</option>
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 mt-8">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-700">Jersey Price</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{JERSEY_PRICE}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-700">Jersey Number</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {jerseyNumber || "-"}
                    </span>
                  </div>
                  <div className="border-t border-orange-300 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        Total Amount
                      </span>
                      <span className="text-3xl font-bold text-orange-600">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  // disabled={totalAmount === 0}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now - ₹{totalAmount}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Jersey;
