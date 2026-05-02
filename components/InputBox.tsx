"use client";

import { useState, useRef, useEffect } from "react";

interface InputBoxProps {
  onSolve: (question: string, imageBase64?: string, mimeType?: string) => void;
  isLoading: boolean;
}

const EXAMPLE_QUESTIONS = [
  "What is photosynthesis and how does it work?",
  "Solve: 2x² + 5x - 3 = 0",
  "Why did World War II happen? Explain simply",
  "What is Newton's second law of motion?",
  "Explain the difference between mitosis and meiosis",
  "What is a metaphor? Give examples",
  "How does the human digestive system work?",
  "What is the French Revolution?",
];

export default function InputBox({ onSolve, isLoading }: InputBoxProps) {
  const [question, setQuestion] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [dragOver, setDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      // Extract base64 data (remove data:image/xxx;base64, prefix)
      const base64 = result.split(",")[1];
      setImageBase64(base64);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed && !imageBase64) return;
    if (isLoading) return;
    onSolve(trimmed, imageBase64 || undefined, imageMimeType);
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
  const canSubmit = (question.trim() || imageBase64) && !isLoading && !isOverLimit;

  return (
    <div className="w-full animate-fade-up">
      <div className="relative rounded-2xl border border-amber-400/20 bg-ink-900 amber-glow overflow-hidden">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

        {/* Image preview */}
        {imagePreview && (
          <div className="px-4 pt-4">
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Uploaded question"
                className="max-h-48 max-w-full rounded-xl border border-ink-600 object-contain"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 border-2 border-ink-900 flex items-center justify-center text-white hover:bg-red-400 transition-colors"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                  <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 mb-1">
              📷 Image uploaded — add a question below or just click Ask AI
            </p>
          </div>
        )}

        {/* Text input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={imagePreview ? "Add a question about the image (optional)..." : `e.g., ${EXAMPLE_QUESTIONS[placeholderIndex]}`}
            disabled={isLoading}
            rows={4}
            className="w-full bg-transparent px-6 py-5 text-slate-200 placeholder-slate-600 font-body text-base leading-relaxed resize-none outline-none transition-all duration-200 disabled:opacity-60"
          />
          {question && !isLoading && (
            <button
              onClick={handleClear}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-ink-700 border border-ink-600 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-ink-700 gap-2">
          <div className="flex items-center gap-2">
            {/* Photo upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              title="Upload a photo of your question"
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-display font-medium
                bg-ink-700 border border-ink-600 text-slate-400
                hover:border-amber-400/40 hover:text-amber-300 hover:bg-ink-600
                transition-all duration-150 disabled:opacity-40"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="1" y="3" width="13" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                <circle cx="7.5" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 3l1-2h3l1 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:block">Upload Photo</span>
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            <span className={`text-xs font-mono transition-colors ${isOverLimit ? "text-red-400" : "text-slate-600"}`}>
              {charCount > 0 ? `${charCount}/2000` : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-700 hidden sm:block">Ctrl+Enter</span>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-display font-semibold text-sm transition-all duration-200
                bg-amber-400 text-ink-950 hover:bg-amber-300 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
                shadow-lg shadow-amber-400/20"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Solving...
                </>
              ) : (
                <>
                  Ask AI
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Drag & drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`mt-3 border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer
          ${dragOver
            ? "border-amber-400/60 bg-amber-400/5 text-amber-300"
            : "border-ink-600 text-slate-600 hover:border-ink-500 hover:text-slate-500"
          }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex items-center justify-center gap-2 text-sm font-body">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          {dragOver ? "Drop your image here!" : "📷 Drag & drop a photo, or click to upload — solve questions from textbooks!"}
        </div>
      </div>

      {/* Example questions */}
      <div className="mt-4">
        <p className="text-xs text-slate-600 mb-2.5 uppercase tracking-wider font-display">Try an example</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.slice(0, 5).map((example, i) => (
            <button
              key={i}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-600 text-slate-400
                hover:border-amber-400/40 hover:text-amber-300 hover:bg-ink-700
                transition-all duration-150 disabled:opacity-40 font-body truncate max-w-[220px]"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
