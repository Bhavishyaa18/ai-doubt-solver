"use client";

import { useState, useRef, useEffect } from "react";

interface InputBoxProps {
  onSolve: (question: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUESTIONS = [
  "Solve: 2x² + 5x - 3 = 0",
  "Find the derivative of f(x) = 3x³ - 2x + 7",
  "If a triangle has sides 3, 4, and 5 cm, find its area",
  "Simplify: (x² - 9) / (x - 3)",
  "A train travels 120 km in 2 hours. Find its speed.",
  "Find the sum of first 20 natural numbers",
];

export default function InputBox({ onSolve, isLoading }: InputBoxProps) {
  const [question, setQuestion] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cycle placeholder questions
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLE_QUESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 2000) {
      setQuestion(val);
      setCharCount(val.length);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;
    onSolve(trimmed);
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    setCharCount(example.length);
    textareaRef.current?.focus();
  };

  const handleClear = () => {
    setQuestion("");
    setCharCount(0);
    textareaRef.current?.focus();
  };

  const isOverLimit = charCount > 1800;

  return (
    <div className="w-full animate-fade-up">
      {/* Main input card */}
      <div className="relative rounded-2xl border border-amber-400/20 bg-ink-900 amber-glow overflow-hidden">
        {/* Top accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={`e.g., ${EXAMPLE_QUESTIONS[placeholderIndex]}`}
            disabled={isLoading}
            rows={4}
            className="w-full bg-transparent px-6 py-5 text-slate-200 placeholder-slate-600 font-body text-base leading-relaxed resize-none outline-none transition-all duration-200 disabled:opacity-60"
          />

          {/* Clear button */}
          {question && !isLoading && (
            <button
              onClick={handleClear}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all duration-150"
              aria-label="Clear input"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-ink-700">
          {/* Char count */}
          <span
            className={`text-xs font-mono transition-colors ${
              isOverLimit ? "text-red-400" : "text-slate-600"
            }`}
          >
            {charCount > 0 ? `${charCount}/2000` : ""}
          </span>

          <div className="flex items-center gap-3">
            {/* Keyboard hint */}
            <span className="text-xs text-slate-700 hidden sm:block">
              Ctrl+Enter to solve
            </span>

            {/* Solve button */}
            <button
              onClick={handleSubmit}
              disabled={!question.trim() || isLoading || isOverLimit}
              className="relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-200
                bg-amber-400 text-ink-950 hover:bg-amber-300 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Solving...
                </>
              ) : (
                <>
                  Solve
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M7 2l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example questions */}
      <div className="mt-4">
        <p className="text-xs text-slate-600 mb-2.5 uppercase tracking-wider font-display">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.slice(0, 4).map((example, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600 text-slate-400
                hover:border-amber-400/40 hover:text-amber-300 hover:bg-ink-700
                transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
                font-body truncate max-w-[200px]"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
