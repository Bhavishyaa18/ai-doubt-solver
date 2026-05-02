import { NextRequest, NextResponse } from "next/server";
import { createClient, getModelName, buildPrompt, parseAIResponse } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    let body: { question?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body. Please send JSON." },
        { status: 400 }
      );
    }

    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required and must be a string." },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();

    if (trimmedQuestion.length === 0) {
      return NextResponse.json(
        { error: "Question cannot be empty." },
        { status: 400 }
      );
    }

    if (trimmedQuestion.length > 2000) {
      return NextResponse.json(
        { error: "Question is too long. Please keep it under 2000 characters." },
        { status: 400 }
      );
    }

    // Check API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured. Please set up your GROQ_API_KEY in .env.local" },
        { status: 503 }
      );
    }

    // Create fresh client and call AI
    const client = createClient();
    const prompt = buildPrompt(trimmedQuestion);
    const model = getModelName();

    const completion = await client.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const rawText = completion.choices[0]?.message?.content;

    if (!rawText) {
      return NextResponse.json(
        { error: "AI returned an empty response. Please try again." },
        { status: 500 }
      );
    }

    const parsed = parseAIResponse(rawText);

    return NextResponse.json({ success: true, data: parsed });

  } catch (error: unknown) {
    console.error("API Error:", error);

    if (error && typeof error === "object" && "status" in error) {
      const apiError = error as { status: number; message?: string };
      if (apiError.status === 401) {
        return NextResponse.json(
          { error: "Invalid API key. Please check your GROQ_API_KEY." },
          { status: 401 }
        );
      }
      if (apiError.status === 429) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment and try again." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Something went wrong while solving your problem. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST." }, { status: 405 });
}
