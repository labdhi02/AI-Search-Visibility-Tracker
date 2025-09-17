import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import redis from '@/lib/redis';

const client = new OpenAI({
  apiKey: process.env.GROK_API,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { brandName } = body;
    if (!brandName) {
      return NextResponse.json({ error: "brandName is required" }, { status: 400 });
    }

    const cacheKey = `grok:${brandName.toLowerCase()}`;

    // 1️⃣ Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Returning cached result for "${brandName}" from Redis.`);
      return NextResponse.json({ output: JSON.parse(cached), cached: true }, { status: 200 });
    } else {
      console.log(`❌ No cached result found for "${brandName}".`);
    }

    // 2️⃣ Call Grok API if not cached
    const prompt = `Given the following brand name, provide a detailed AI-powered brand analysis as a JSON object with these fields:
{
  brand_visibility: string,
  competitor_mentions: string[],
  brand_sentiment: string,
  competitor_analysis: string
}
Brand: "${brandName}"

Instructions:
- brand_visibility: Describe how visible the brand is in AI-powered search results and across AI platforms.
- competitor_mentions: List all major competitors mentioned.
- brand_sentiment: Summarize the overall sentiment (positive, negative, neutral) towards the brand.
- competitor_analysis: Provide a detailed analysis of the brand's positioning and comparison with competitors with top 3 competitors in bullet points.
If you cannot find some fields, return them as empty or null. Only return valid JSON.`;

    const response = await client.responses.create({
      model: 'openai/gpt-oss-20b',
      input: prompt,
    });

    let text = response.output_text || "";
    if (text.startsWith("```")) text = text.replace(/```(json)?/g, "").trim();

    let extracted = { brand_visibility: "", competitor_mentions: [], brand_sentiment: "", competitor_analysis: "" };
    try { extracted = JSON.parse(text); } catch {
      console.log("⚠️ Failed to parse Grok response as JSON, returning empty object");
    }

    // 3️⃣ Store in Redis with TTL 24 hours (86400 seconds)
    await redis.set(cacheKey, JSON.stringify(extracted), "EX", 86400);
    console.log(`Cached result for "${brandName}" in Redis (TTL: 24h)`);

    return NextResponse.json({ output: extracted, cached: false }, { status: 200 });
  } catch (error) {
    console.error("API call failed:", error);
    return NextResponse.json({ error: 'An error occurred while fetching brand analysis' }, { status: 500 });
  }
};

export const GET = () =>
  NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });