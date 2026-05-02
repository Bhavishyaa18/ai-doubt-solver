"use client";

import { useState } from "react";
import type { SolveResponse } from "@/lib/openai";

interface ResultProps {
  result: SolveResponse;
  question: string;
  onTryAnother: () => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium
        bg-ink-700 border border-ink-600 text-slate-400
        hover:border-amber-400/40 hover:text-amber-300 transition-all duration-150"
      title="Copy answer"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect
              x="4"
              y="4"
              width="7"
              height="7"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M8 4V2.5A1.5 1.5 0 006.5 1H2.5A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function Result({ result, question, onTryAnother }: ResultProps) {
  const { steps, finalAnswer, concept } = result;

  const fullAnswerText = `Question: ${question}\n\nConcept: ${concept}\n\nSteps:\n${steps.map((s, i) => `Step ${i + 1}: ${s}`).join("\n\n")}\n\nFinal Answer: ${finalAnswer}`;

  return (
    <div className="w-full space-y-4 animate-fade-up">

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-400 font-display">
            Solution ready
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={fullAnswerText} />
          <button
            onClick={onTryAnother}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-medium
              bg-ink-700 border border-ink-600 text-slate-400
              hover:border-amber-400/40 hover:text-amber-300 transition-all duration-150"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M10 2.5A5 5 0 112 7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M2 4V7H5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try another
          </button>
        </div>
      </div>

      {/* Question recap */}
      <div className="rounded-xl border border-ink-600 bg-ink-800 px-4 py-3">
        <p className="text-xs text-slate-600 font-display uppercase tracking-wider mb-1">
          Your question
        </p>
        <p className="text-slate-300 text-sm leading-relaxed font-body">
          {question}
        </p>
      </div>

      {/* Concept badge */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-display font-semibold
          bg-amber-400/10 border border-amber-400/25 text-amber-300">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
            <path d="M5.5 1a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 1a3.5 3.5 0 110 7 3.5 3.5 0 010-7zm0 1.5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h1.5a.5.5 0 000-1H6V4a.5.5 0 00-.5-.5z" />
          </svg>
          Concept: {concept}
        </span>
      </div>

      {/* Steps */}
      <div className="rounded-2xl border border-ink-600 bg-ink-900 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ink-700 flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M2 7.5h11M2 3.5h11M2 11.5h6"
              stroke="#fbbf24"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm font-display font-semibold text-slate-300">
            Step-by-step solution
          </span>
          <span className="ml-auto text-xs text-slate-600 font-mono">
            {steps.length} {steps.length === 1 ? "step" : "steps"}
          </span>
        </div>

        <div className="divide-y divide-ink-800">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card flex gap-4 px-5 py-4 hover:bg-ink-800/50 border-l-2 border-transparent"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Step number */}
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))",
                    border: "1px solid rgba(251,191,36,0.25)",
                    color: "#fcd34d",
                  }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-sm leading-relaxed font-body whitespace-pre-wrap break-words">
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Answer — hero card */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 via-amber-400/5 to-transparent" />
        <div className="absolute inset-0 border border-amber-400/30 rounded-2xl" />

        {/* Top glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

        <div className="relative px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2.5 2.5L8 2"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-xs font-display font-bold text-amber-400 uppercase tracking-widest">
                  Final Answer
                </span>
              </div>

              <p className="text-slate-100 font-display font-semibold text-lg leading-relaxed whitespace-pre-wrap break-words">
                {finalAnswer}
              </p>
            </div>

            {/* Copy just the answer */}
            <CopyButton text={finalAnswer} />
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-slate-700 font-body pb-2">
        Double-check important results. AI can make mistakes.
      </p>
    </div>
  );
}
