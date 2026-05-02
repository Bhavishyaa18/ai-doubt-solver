import { NextRequest, NextResponse } from "next/server";
import { createClient, buildPrompt, parseAIResponse } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    let body: { question?: string; imageBase64?: string; mimeType?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { question, imageBase64, mimeType } = body;

    if (!question && !imageBase64) {
      return NextResponse.json({ error: "Please provide a question or an image." }, { status: 400 });
    }

    const trimmedQuestion = question?.trim() || "";

    if (trimmedQuestion.length > 2000) {
      return NextResponse.json({ error: "Question is too long. Max 2000 characters." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service is not configured. Please set GROQ_API_KEY." }, { status: 503 });
    }

    const client = createClient();
    let rawText = "";

    if (imageBase64) {
      // Use Groq vision model for images
      const imageUrl = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;
      const textPrompt = trimmedQuestion
        ? `The student has uploaded an image and asks: "${trimmedQuestion}". Please read the image carefully and answer.`
        : "Please read this image carefully. Identify the question or problem shown and solve it step by step for a student.";

      const visionPrompt = `You are a helpful student tutor. ${textPrompt}

Respond in this EXACT format:

CONCEPT: [Subject and topic shown in the image]

STEPS:
Step 1: [First step]
Step 2: [Second step]
Step 3: [Continue as needed]

FINAL ANSWER: [Clear complete answer]`;

      const visionResponse = await client.chat.completions.create({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        max_tokens: 1500,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
              {
                type: "text",
                text: visionPrompt,
              },
            ],
          },
        ],
      });

      rawText = visionResponse.choices[0]?.message?.content || "";
    } else {
      // Text only
      const textResponse = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{ role: "user", content: buildPrompt(trimmedQuestion) }],
      });

      rawText = textResponse.choices[0]?.message?.content || "";
    }

    if (!rawText) {
      return NextResponse.json({ error: "AI returned empty response. Please try again." }, { status: 500 });
    }

    const parsed = parseAIResponse(rawText);
    return NextResponse.json({ success: true, data: parsed });

  } catch (error: unknown) {
    console.error("API Error:", error);

    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number };
      if (apiError.status === 401) return NextResponse.json({ error: "Invalid API key." }, { status: 401 });
      if (apiError.status === 429) return NextResponse.json({ error: "Too many requests. Please wait and try again." }, { status: 429 });
    }

    const errMsg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Something went wrong: ${errMsg}` }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST." }, { status: 405 });
}