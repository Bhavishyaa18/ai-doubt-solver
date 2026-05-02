import OpenAI from "openai";

export interface SolveResponse {
  steps: string[];
  finalAnswer: string;
  concept: string;
  rawText: string;
}

// Create client fresh on each call instead of at module load time
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

Your response MUST follow this EXACT format with these EXACT markers:

CONCEPT: [Name the mathematical concept(s) used, e.g. "Quadratic Equations", "Pythagorean Theorem"]

STEPS:
Step 1: [First step with clear explanation]
Step 2: [Second step with clear explanation]
Step 3: [Continue as needed...]

FINAL ANSWER: [The complete final answer, clearly stated]

Rules:
- Use simple language suitable for students
- Show ALL intermediate calculations
- Explain WHY each step is done, not just what
- Be encouraging and clear
- If the question is not math-related, politely say so and ask for a math question

Question: ${question}`;
}

export function parseAIResponse(rawText: string): SolveResponse {
  const steps: string[] = [];
  let finalAnswer = "";
  let concept = "";

  const conceptMatch = rawText.match(/CONCEPT:\s*(.+?)(?:\n|$)/i);
  if (conceptMatch) concept = conceptMatch[1].trim();

  const answerMatch = rawText.match(/FINAL ANSWER:\s*([\s\S]+?)(?:\n\n|$)/i);
  if (answerMatch) finalAnswer = answerMatch[1].trim();

  const stepsSection = rawText.match(/STEPS:\s*([\s\S]+?)(?=FINAL ANSWER:|$)/i);
  if (stepsSection) {
    const stepMatches = stepsSection[1].matchAll(/Step\s+(\d+):\s*([\s\S]+?)(?=Step\s+\d+:|$)/gi);
    for (const match of stepMatches) {
      const stepContent = match[2].trim();
      if (stepContent) steps.push(stepContent);
    }
  }

  if (steps.length === 0) {
    const cleanText = rawText
      .replace(/CONCEPT:.+?\n/i, "")
      .replace(/FINAL ANSWER:.+/is, "")
      .replace(/STEPS:/i, "")
      .trim();
    if (cleanText) steps.push(cleanText);
  }

  if (!finalAnswer) {
    const sentences = rawText.split(/\.\s+/);
    finalAnswer = sentences[sentences.length - 1]?.trim() || "See explanation above.";
  }

  if (!concept) concept = "Mathematics";

  return { steps, finalAnswer, concept, rawText };
}
