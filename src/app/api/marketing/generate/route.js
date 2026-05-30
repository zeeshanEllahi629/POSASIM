import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OpenAI } from "openai";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { productName, features, audience } = await req.json();

    if (!productName || !features || !audience) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
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
    const prompt = `You are an expert Digital Marketing AI Copywriter.
Write an engaging Facebook/Instagram ad for the following product:
Product: ${productName}
Features: ${features}
Target Audience: ${audience}

Return ONLY a valid JSON object with the following keys:
- "headline": A catchy, scroll-stopping headline (max 60 chars).
- "primary_text": Engaging ad copy including emojis and a strong call-to-action (max 300 chars).
- "platforms": An array of strings representing the best platforms for this ad (e.g., ["Facebook", "Instagram", "TikTok"]).

JSON format only, no markdown blocks.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
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

    // Optionally save the generated copy to the database
    // await prisma.marketing_content.create({ ... })

    return NextResponse.json({ success: true, data: aiData });
  } catch (error) {
    console.error("Error generating ad copy:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
