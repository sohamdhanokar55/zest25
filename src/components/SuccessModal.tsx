interface SuccessModalProps {
  isOpen: boolean;
  countdown: number;
  srNo: number | null;
  emailStatus: "sent" | "failed" | "skipped" | null;
}

const SuccessModal = ({
  isOpen,
  countdown,
  srNo,
  emailStatus,
}: SuccessModalProps) => {
  if (!isOpen) return null;

  const renderEmailBadge = () => {
    if (!emailStatus) return null;

    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";

    if (emailStatus === "sent") {
      return (
        <span className={`${baseClasses} bg-green-100 text-green-700`}>
          Email Sent
        </span>
      );
    }

    if (emailStatus === "failed") {
      return (
        <span className={`${baseClasses} bg-red-100 text-red-700`}>
          Email Failed
        </span>
      );
    }

    if (emailStatus === "skipped") {
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-700`}>
          Email Skipped
        </span>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8 animate-[fadeIn_0.25s_ease-out]">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          Registration Successful!
        </h2>
        <p className="text-gray-700 text-center mb-2">
          Your registration has been successfully recorded.
        </p>
        {srNo !== null && (
          <p className="text-center text-sm font-semibold text-gray-900 mb-3">
            Registration Number:{" "}
            <span className="text-orange-600">#{srNo}</span>
          </p>
        )}
        <div className="flex justify-center mb-4">{renderEmailBadge()}</div>
        <p className="text-sm text-gray-500 text-center">
          Redirecting to Home in{" "}
          <span className="font-semibold text-orange-600">{countdown}</span>{" "}
          seconds…
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
