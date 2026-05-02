"use client";

import { useState, useRef } from "react";
import InputBox from "@/components/InputBox";
import Result from "@/components/Result";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";
import type { SolveResponse } from "@/lib/openai";

type AppState = "idle" | "loading" | "result" | "error";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [result, setResult] = useState<SolveResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSolve = async (question: string) => {
    setCurrentQuestion(question);
    setAppState("loading");
    setResult(null);
    setErrorMessage("");

    // Scroll to results area
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get solution.");
      }

      if (!data.success) {
        throw new Error(data.error || "An unexpected error occurred.");
      }

      setResult(data.data);
      setAppState("result");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMessage(msg);
      setAppState("error");
    }
  };

  const handleTryAnother = () => {
    setAppState("idle");
    setResult(null);
    setCurrentQuestion("");
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    if (currentQuestion) {
      handleSolve(currentQuestion);
    } else {
      setAppState("idle");
    }
  };

  return (
    <main className="min-h-screen bg-ink-950 grid-bg relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-400/4 blur-[100px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-20">

        {/* Header */}
        <header className="pt-12 pb-10 text-center animate-fade-up">
          {/* Logo mark */}
          <div className="flex items-center justify-center mb-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-ink-800 border border-amber-400/25 flex items-center justify-center amber-glow-strong">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 3L3 9v10l11 6 11-6V9L14 3z"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3v16M3 9l11 6 11-6"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    strokeOpacity="0.5"
                  />
                  <circle cx="14" cy="14" r="3" fill="#fbbf24" fillOpacity="0.8" />
                </svg>
              </div>
              {/* Live indicator */}
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-ink-950 animate-pulse" />
            </div>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-100 mb-3 tracking-tight">
            AI Doubt Solver
          </h1>
          <p className="text-slate-500 font-body text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Type any math problem. Get a clear,{" "}
            <span className="text-slate-400">step-by-step solution</span>{" "}
            explained like a patient tutor.
          </p>

          {/* Stats pills */}
          <div className="flex items-center justify-center gap-4 mt-5">
            {[
              { label: "Algebra" },
              { label: "Calculus" },
              { label: "Geometry" },
              { label: "Trigonometry" },
              { label: "Statistics" },
            ].map((tag) => (
              <span
                key={tag.label}
                className="text-xs font-display text-slate-600 hidden sm:block"
              >
                {tag.label}
              </span>
            ))}
          </div>
        </header>

        {/* Input section */}
        <section className="animation-delay-100 animate-fade-up">
          <InputBox
            onSolve={handleSolve}
            isLoading={appState === "loading"}
          />
        </section>

        {/* Results section */}
        <section ref={resultRef} className="mt-8">
          {appState === "loading" && <LoadingSkeleton />}

          {appState === "result" && result && (
            <Result
              result={result}
              question={currentQuestion}
              onTryAnother={handleTryAnother}
            />
          )}

          {appState === "error" && (
            <ErrorDisplay message={errorMessage} onRetry={handleRetry} />
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center animation-delay-300 animate-fade-up">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-ink-700" />
            <span className="text-xs text-slate-700 font-mono px-3">
              AI Doubt Solver
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-ink-700" />
          </div>
          <p className="text-xs text-slate-700 font-body">
            Built for students · Powered by AI · Free to use
          </p>
        </footer>
      </div>
    </main>
  );
}
