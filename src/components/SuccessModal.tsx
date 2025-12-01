interface SuccessModalProps {
  isOpen: boolean;
  countdown: number;
}

const SuccessModal = ({ isOpen, countdown }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">
          Payment Successful!
        </h2>
        <p className="text-gray-700 text-center mb-4">
          Your registration has been recorded.
        </p>
        <p className="text-sm text-gray-500 text-center">
          Redirecting to home page in{" "}
          <span className="font-semibold text-orange-600">{countdown}</span>{" "}
          seconds…
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
