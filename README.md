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
- **AI**: OpenAI API (GPT-4o mini) or Anthropic (Claude)
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

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

**For OpenAI:**
```
OPENAI_API_KEY=sk-...your-key-here...
AI_PROVIDER=openai
```

**For Anthropic (Claude):**
```
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
AI_PROVIDER=anthropic
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Route

### `POST /api/solve`

**Request:**
```json
{
  "question": "Solve: 2x² + 5x - 3 = 0"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "concept": "Quadratic Equations",
    "steps": [
      "Identify the equation: 2x² + 5x - 3 = 0...",
      "Use the quadratic formula: x = (-b ± √(b²-4ac)) / 2a...",
      "Substitute a=2, b=5, c=-3..."
    ],
    "finalAnswer": "x = 1/2 or x = -3",
    "rawText": "..."
  }
}
```

**Error Response:**
```json
{
  "error": "Question is required and must be a string."
}
```

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY` (or `ANTHROPIC_API_KEY`)
   - `AI_PROVIDER` = `openai` or `anthropic`
4. Deploy!

## Getting API Keys

- **OpenAI**: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Anthropic**: [console.anthropic.com](https://console.anthropic.com)

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
