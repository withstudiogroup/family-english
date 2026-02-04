import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang = "ko" } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text to ${targetLang === "ko" ? "Korean" : "English"}. Only return the translation, nothing else.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      max_tokens: 500,
    });

    const translation = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ translation });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
