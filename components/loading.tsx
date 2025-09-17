// app/loading.tsx (global) 
// or app/dashboard/loading.tsx (page-level)
export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <svg
        className="animate-spin h-16 w-16 text-white mb-6 drop-shadow-lg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="text-xl font-semibold tracking-wide">Loading...</span>
    </div>
  );
}
