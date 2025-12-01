interface LoadingSkeletonProps {
  variant?: "fullPage";
}

const LoadingSkeleton = ({ variant = "fullPage" }: LoadingSkeletonProps) => {
  if (variant === "fullPage") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-3xl mx-4 bg-white rounded-2xl shadow-2xl p-8 animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-6" />
          <div className="space-y-4">
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded mt-4" />
            <div className="h-10 w-full bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded mt-4" />
            <div className="h-10 w-full bg-gray-200 rounded" />
          </div>
          <div className="mt-8 h-12 w-40 bg-gray-200 rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
