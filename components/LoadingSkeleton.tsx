"use client";

const LOADING_MESSAGES = [
  "Reading your question...",
  "Identifying the concept...",
  "Working through the solution...",
  "Writing step-by-step explanation...",
  "Almost there...",
];

import { useState, useEffect } from "react";

export default function LoadingSkeleton() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-4 animate-fade-up">
      {/* Status */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <span className="text-sm text-slate-500 font-body transition-all">
          {LOADING_MESSAGES[messageIndex]}
        </span>
      </div>

      {/* Skeleton cards */}
      <div className="rounded-2xl border border-ink-600 bg-ink-900 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ink-700">
          <div className="h-4 w-40 rounded-md bg-ink-700 animate-pulse" />
        </div>

        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 px-5 py-4 border-b border-ink-800 last:border-0">
            <div className="w-7 h-7 rounded-full bg-ink-700 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div
                className="h-3.5 rounded-md bg-ink-700 animate-pulse"
                style={{ width: `${75 + i * 7}%` }}
              />
              <div
                className="h-3.5 rounded-md bg-ink-700 animate-pulse"
                style={{ width: `${50 + i * 5}%` }}
              />
              {i === 2 && (
                <div className="h-3.5 w-32 rounded-md bg-ink-700 animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Final answer skeleton */}
      <div className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-6 space-y-3">
        <div className="h-3 w-24 rounded-md bg-amber-400/20 animate-pulse" />
        <div className="h-5 w-3/4 rounded-md bg-ink-700 animate-pulse" />
        <div className="h-5 w-1/2 rounded-md bg-ink-700 animate-pulse" />
      </div>
    </div>
  );
}
