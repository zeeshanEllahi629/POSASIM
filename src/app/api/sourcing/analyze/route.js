import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { keyword } = await req.json();

    if (!keyword) {
      return NextResponse.json({ success: false, error: "Keyword is required" }, { status: 400 });
    }

    // Fetch API Key from database
    const keySetting = await prisma.site_settings.findUnique({
      where: { key_name: "openai_api_key" }
    });

    if (!keySetting || !keySetting.value) {
      return NextResponse.json({ success: false, error: "OpenAI API Key not configured. Please set it in Settings > AI Configuration." }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: keySetting.value });

    // Call OpenAI
    const prompt = `You are a Global Sourcing Expert AI. Analyze the product keyword: "${keyword}".
Return ONLY a valid JSON object with the following keys:
- "demand_score": A float from 1.0 to 10.0 estimating global market demand.
- "competition_score": A float from 1.0 to 10.0 estimating market competition.
- "estimated_margin": A float representing estimated retail profit margin percentage (e.g., 45.5).
- "ai_analysis_summary": A 3-sentence summary explaining these scores based on global manufacturing and retail trends.
- "recommended_action": A short 3-4 word recommendation (e.g. "Highly Recommended", "Proceed with Caution").

JSON format only, no markdown blocks.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 300,
    });

    let aiData;
    try {
      const content = response.choices[0].message.content.trim();
      // Remove possible markdown formatting from GPT
      const jsonStr = content.replace(/^```json/g, "").replace(/```$/g, "").trim();
      aiData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse OpenAI JSON:", parseError);
      return NextResponse.json({ success: false, error: "Failed to parse AI response" }, { status: 500 });
    }

    const newRecommendation = await prisma.sourcing_recommendation.create({
      data: {
        keyword: keyword.toLowerCase(),
        demand_score: parseFloat(aiData.demand_score),
        competition_score: parseFloat(aiData.competition_score),
        estimated_margin: parseFloat(aiData.estimated_margin),
        ai_analysis_summary: aiData.ai_analysis_summary,
        recommended_action: aiData.recommended_action
      }
    });

    return NextResponse.json({ success: true, data: newRecommendation });
  } catch (error) {
    console.error("Error analyzing product:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
