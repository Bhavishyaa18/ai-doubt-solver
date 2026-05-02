# AI Doubt Solver 🎓

A clean, minimal web app that helps students solve math problems step-by-step using AI.

## Features

- **Step-by-step solutions** — Every solution is broken down clearly
- **Concept identification** — Know which math concept is being used
- **Copy to clipboard** — Copy the full solution or just the final answer
- **Example questions** — Quick-start with pre-loaded examples
- **Loading skeleton** — Smooth UX while the AI thinks
- **Error handling** — Graceful errors with retry support
- **Mobile responsive** — Works great on all screen sizes
- **Keyboard shortcut** — Press `Ctrl+Enter` to solve instantly

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: Groq API 
- **Language**: TypeScript

## Project Structure

```
ai-doubt-solver/
├── app/
│   ├── globals.css          # Global styles + fonts
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main page (state management)
│   └── api/
│       └── solve/
│           └── route.ts     # POST /api/solve endpoint
├── components/
│   ├── InputBox.tsx         # Question textarea + submit
│   ├── Result.tsx           # Step-by-step solution display
│   ├── LoadingSkeleton.tsx  # Animated loading state
│   └── ErrorDisplay.tsx     # Error messages + retry
└── lib/
    └── openai.ts            # AI client + prompt + parser
```


## Supported Math Topics

- Algebra (equations, inequalities, polynomials)
- Calculus (derivatives, integrals, limits)
- Geometry (areas, volumes, theorems)
- Trigonometry (sin, cos, tan, identities)
- Statistics (mean, median, probability)
- Number theory (factors, primes, sequences)
- Word problems

## Customization

### Change the AI model

Edit `lib/openai.ts`:
```ts
export function getModelName(): string {
  const provider = process.env.AI_PROVIDER || "openai";
  if (provider === "anthropic") return "claude-3-5-haiku-20241022"; // Change here
  return "gpt-4o-mini"; // Or here
}
```

### Modify the prompt

Edit the `buildPrompt` function in `lib/openai.ts` to adjust how the AI responds.

### Add more example questions

Edit the `EXAMPLE_QUESTIONS` array in `components/InputBox.tsx`.

## License

MIT
