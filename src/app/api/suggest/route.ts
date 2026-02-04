import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { context, level = "intermediate", scenario } = await request.json();

    if (!context) {
      return NextResponse.json({ error: "Context is required" }, { status: 400 });
    }

    const levelGuide = {
      beginner: "Use very simple words and short sentences. Maximum 5 words per suggestion.",
      intermediate: "Use everyday vocabulary with common phrases. Maximum 10 words per suggestion.",
      advanced: "Use natural, fluent expressions with varied vocabulary.",
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are helping a Korean student learn English in a "${scenario}" scenario.
Based on the conversation context, suggest 3 possible responses the student could say.
${levelGuide[level as keyof typeof levelGuide]}

Return ONLY a JSON array with 3 suggestions, each with "english" and "korean" fields.
Example: [{"english": "Yes, please", "korean": "네, 주세요"}]`,
        },
        {
          role: "user",
          content: `Conversation context:\n${context}\n\nSuggest 3 responses:`,
        },
      ],
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content || "[]";

    // JSON 파싱 시도
    let suggestions;
    try {
      // 마크다운 코드 블록 제거
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      suggestions = JSON.parse(cleanContent);
    } catch {
      suggestions = [
        { english: "I understand", korean: "이해했어요" },
        { english: "Can you repeat that?", korean: "다시 말해줄래요?" },
        { english: "Thank you", korean: "감사합니다" },
      ];
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Suggestion error:", error);
    return NextResponse.json(
      { error: "Suggestion failed" },
      { status: 500 }
    );
  }
}
