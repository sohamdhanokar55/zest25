import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import {
  createOrder,
  loadRazorpay,
  RazorpaySuccessResponse,
} from "../utils/razorpay";

import LoadingSkeleton from "../components/LoadingSkeleton";

import SuccessModal from "../components/SuccessModal";

const nameRegex = /^[A-Za-z ]+$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Jersey = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [jerseyNumber, setJerseyNumber] = useState("");

  const [department, setDepartment] = useState("");

  const [semester, setSemester] = useState("");

  const [size, setSize] = useState("");

  const [nameError, setNameError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);

  const [jerseyNumberError, setJerseyNumberError] = useState<string | null>(
    null
  );

  const [departmentError, setDepartmentError] = useState<string | null>(null);

  const [semesterError, setSemesterError] = useState<string | null>(null);

  const [sizeError, setSizeError] = useState<string | null>(null);

  const [isPrePaymentOpen, setIsPrePaymentOpen] = useState(false);

  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [successCountdown, setSuccessCountdown] = useState(5);

  const [registrationNumber, setRegistrationNumber] = useState<number | null>(
    null
  );

  const JERSEY_PRICE = 300;

  const totalAmount = JERSEY_PRICE;

  useEffect(() => {
    if (!isSuccessModalOpen) return;

    setSuccessCountdown(5);

    const interval = setInterval(() => {
      setSuccessCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          navigate("/");

          window.location.reload();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSuccessModalOpen, navigate]);

  const validateForm = () => {
    let hasError = false;

    setNameError(null);

    setEmailError(null);

    setJerseyNumberError(null);

    setDepartmentError(null);

    setSemesterError(null);

    setSizeError(null);

    if (!name) {
      setNameError("Name is required");

      hasError = true;
    } else if (!nameRegex.test(name)) {
      setNameError("Name must contain only letters and spaces");

      hasError = true;
    }

    if (!email) {
      setEmailError("Email is required");

      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");

      hasError = true;
    }

    if (!jerseyNumber) {
      setJerseyNumberError("Jersey number is required");

      hasError = true;
    } else {
      const jerseyNum = parseInt(jerseyNumber);

      if (isNaN(jerseyNum) || jerseyNum < 1 || jerseyNum > 999) {
        setJerseyNumberError("Please enter a valid jersey number (1-999)");

        hasError = true;
      }
    }

    if (!department) {
      setDepartmentError("Department is required");

      hasError = true;
    }

    if (!semester) {
      setSemesterError("Semester is required");

      hasError = true;
    }

    if (!size) {
      setSizeError("Jersey size is required");

      hasError = true;
    }

    return !hasError;
  };

  const handleOpenPrePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsPrePaymentOpen(true);
  };

  const handleStartPayment = async () => {
    try {
      setIsPrePaymentOpen(false);

      setIsLoadingPayment(true);

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

        handler: async (response: RazorpaySuccessResponse) => {
          try {
            setIsLoadingPayment(false);

            setIsSubmitting(true);

            const payload = {
              nameOnJersey: name,

              numberOnJersey: jerseyNumber,

              department,

              size, // S, M, L, XL, XXL

              email,

              order_id: order.order_id,

              payment_id: response.razorpay_payment_id,

              payment_signature: response.razorpay_signature,
            };

            console.log("JERSEY_PAYLOAD_SENT_TO_BACKEND", payload);

            const res = await fetch(
              "https://apvcouncil.in/api/store-jersey.php",

              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json",
                },

                body: JSON.stringify(payload),
              }
            );

            if (!res.ok) {
              setIsSubmitting(false);

              console.error(
                "Failed to store jersey registration",

                await res.text()
              );

              alert(
                "Payment succeeded, but failed to store jersey registration. Please contact the organizers with your payment ID."
              );

              return;
            }

            const data = await res.json();

            if (!data.success) {
              setIsSubmitting(false);

              console.error("Jersey backend reported failure", data);

              alert(
                "Payment succeeded, but jersey registration failed on the server. Please contact the organizers."
              );

              return;
            }

            setRegistrationNumber(
              typeof data.sr_no === "number" ? data.sr_no : null
            );

            setIsSubmitting(false);

            setIsSuccessModalOpen(true);

            // Reset form

            setName("");

            setEmail("");

            setJerseyNumber("");

            setDepartment("");

            setSemester("");

            setSize("");
          } catch (error) {
            console.error(
              "Error while storing jersey registration on backend",

              error
            );

            setIsSubmitting(false);

            alert(
              "Payment succeeded, but an error occurred while storing jersey registration. Please contact the organizers."
            );
          }
        },

        theme: {
          color: "#f97316",
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.open();

      setIsLoadingPayment(false);
    } catch (error) {
      console.error("Failed to initialize payment", error);

      alert("Failed to initialize payment. Please try again.");

      setIsLoadingPayment(false);
    }
  };

  const showSkeleton = isLoadingPayment || isSubmitting;

  return (
    <Layout>
      {showSkeleton && <LoadingSkeleton variant="fullPage" />}

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

                  <p className="text-yellow-700">
                    Jersey is mandatory for participation in all events. You
                    will not be allowed to participate if you do not have the
                    official Zest Jersey.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}

            <form onSubmit={handleOpenPrePayment} className="p-8">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      nameError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                  />

                  {nameError && (
                    <p className="mt-1 text-xs text-red-600">{nameError}</p>
                  )}
                </div>

                {/* Email */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      emailError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />

                  {emailError && (
                    <p className="mt-1 text-xs text-red-600">{emailError}</p>
                  )}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      jerseyNumberError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter jersey number (1-999)"
                  />

                  {jerseyNumberError && (
                    <p className="mt-1 text-xs text-red-600">
                      {jerseyNumberError}
                    </p>
                  )}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      departmentError ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Department</option>

                    <option value="AN">AN</option>

                    <option value="TE">TE</option>

                    <option value="ME">ME</option>

                    <option value="AE">AE</option>

                    <option value="CE">CE</option>
                  </select>

                  {departmentError && (
                    <p className="mt-1 text-xs text-red-600">
                      {departmentError}
                    </p>
                  )}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      semesterError ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Semester</option>

                    {["1K", "2K", "3K", "4K", "5K", "6K"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {semesterError && (
                    <p className="mt-1 text-xs text-red-600">{semesterError}</p>
                  )}
                </div>
              </div>

              {/* Size Chart + Size Selection */}

              <div className="mt-8 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Jersey Size Chart
                  </h3>

                  <div className="w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src="/zest/sizechart.png"
                      alt="Jersey Size Chart"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jersey Size *
                  </label>

                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      sizeError ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Size</option>

                    <option value="S">S - 36</option>

                    <option value="M">M - 38</option>

                    <option value="L">L - 40</option>

                    <option value="XL">XL - 42</option>

                    <option value="XXL">XXL - 44</option>
                  </select>

                  {sizeError && (
                    <p className="mt-1 text-xs text-red-600">{sizeError}</p>
                  )}
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

                  {/* <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-700">Jersey Number</span>

                    <span className="text-lg font-semibold text-gray-900">
                      {jerseyNumber || "-"}
                    </span>
                  </div> */}

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
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now - ₹{totalAmount}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Pre-Payment Alert Popup */}

      {isPrePaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Important Notice Before Payment
            </h2>

            <p className="text-sm text-gray-700 mb-2">
              Please take a screenshot of the payment success page after
              completing the transaction.
            </p>

            <p className="text-sm text-gray-700 mb-2">
              If you do not receive the confirmation email, kindly contact the
              organizer immediately.
            </p>

            <p className="text-xs text-gray-600 mb-4">
              <span className="font-semibold">Note:</span> No refund will be
              provided without valid proof of payment. For any issues, please
              contact the organizers at least 5 days before the event begins.
            </p>
            <p className="text-sm text-gray-800 mb-2">
              <span className="font-semibold">
                Contact:
                <br />
              </span>{" "}
              Soham Dhanokar <br />
              (OCM Head) <br /> 9321895202
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsPrePaymentOpen(false)}
                className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleStartPayment}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                I Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        countdown={successCountdown}
        srNo={registrationNumber}
        emailStatus={null}
      />
    </Layout>
  );
};

export default Jersey;
