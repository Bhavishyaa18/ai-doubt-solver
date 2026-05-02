import OpenAI from "openai";

export interface SolveResponse {
  steps: string[];
  finalAnswer: string;
  concept: string;
  rawText: string;
}

export function createClient() {
  const apiKey = process.env.GROQ_API_KEY;
  return new OpenAI({
    apiKey: apiKey || "",
    baseURL: "https://api.groq.com/openai/v1",
  });
}

export function getModelName(): string {
  return "llama-3.3-70b-versatile";
}

export function buildPrompt(question: string): string {
  return `You are an expert math tutor helping a school or early college student. Solve the following problem with clear, detailed explanations.

Your response MUST follow this EXACT format:

CONCEPT: [The mathematical concept used]

STEPS:
Step 1: [First step]
Step 2: [Second step]
Step 3: [Continue as needed]

FINAL ANSWER: [The complete final answer]

Rules:
- Use simple language for students
- Show ALL calculations
- Explain WHY each step is done
- Be encouraging and clear

Question: ${question}`;
}

export function parseAIResponse(rawText: string): SolveResponse {
  const steps: string[] = [];
  let finalAnswer = "";
  let concept = "";

  // Extract concept
  const conceptMatch = rawText.match(/CONCEPT:\s*(.+?)(?:\n|$)/i);
  if (conceptMatch) {
    concept = conceptMatch[1].trim();
  }

  // Extract final answer - find index and slice instead of regex with s flag
  const finalAnswerIndex = rawText.search(/FINAL ANSWER:/i);
  if (finalAnswerIndex !== -1) {
    finalAnswer = rawText.slice(finalAnswerIndex).replace(/FINAL ANSWER:\s*/i, "").trim();
  }

  // Extract steps section
  const stepsIndex = rawText.search(/STEPS:/i);
  const endIndex = finalAnswerIndex !== -1 ? finalAnswerIndex : rawText.length;
  
  if (stepsIndex !== -1) {
    const stepsText = rawText.slice(stepsIndex, endIndex);
    const stepRegex = /Step\s+\d+:\s*([\s\S]+?)(?=Step\s+\d+:|$)/gi;
    let match;
    while ((match = stepRegex.exec(stepsText)) !== null) {
      const stepContent = match[1].trim();
      if (stepContent) steps.push(stepContent);
    }
  }

  // Fallback if no steps found
  if (steps.length === 0 && rawText.trim()) {
    steps.push(rawText.trim());
  }

  if (!finalAnswer) {
    const lines = rawText.split("\n").filter((l) => l.trim());
    finalAnswer = lines[lines.length - 1] || "See explanation above.";
  }

  if (!concept) concept = "Mathematics";

  return { steps, finalAnswer, concept, rawText };
}
