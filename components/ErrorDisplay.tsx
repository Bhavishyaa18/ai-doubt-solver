"use client";

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="w-full animate-fade-up">
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L1 14h14L8 1z"
                stroke="#ef4444"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 6v3M8 11.5v.5"
                stroke="#ef4444"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-display font-semibold text-red-400 mb-1">
              Something went wrong
            </h3>
            <p className="text-sm text-slate-400 font-body leading-relaxed">
              {message}
            </p>

            <button
              onClick={onRetry}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-display font-semibold
                bg-red-500/10 border border-red-500/20 text-red-400
                hover:bg-red-500/15 hover:border-red-500/35 transition-all duration-150"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path
                  d="M11 2A5.5 5.5 0 112 7"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path
                  d="M2 4.5V7H4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
