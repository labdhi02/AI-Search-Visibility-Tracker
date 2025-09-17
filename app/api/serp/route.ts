import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

const GEMINI_API = process.env.GEMINI_API;
const GOOGLE_SERP_API = process.env.GOOGLE_SERP_API;

export async function POST(req: NextRequest) {
  const { brandName } = await req.json();

  if (!brandName) {
    return NextResponse.json({ error: "brandName is required" }, { status: 400 });
  }

  const cacheKey = `serp:${brandName.toLowerCase()}`;

  try {
    // 1️⃣ Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Returning cached SERP result for "${brandName}" from Redis.`);
      return NextResponse.json(JSON.parse(cached));
    } else {
      console.log(`❌ No cached SERP result found for "${brandName}".`);
    }

    // GOOGLE SERP FETCH
    const serpRes = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(brandName)}&api_key=${GOOGLE_SERP_API}`
    );
    const serpData = await serpRes.json().catch(() => null);

    // Combine top 5 SERP results
    interface OrganicResult {
      title: string;
      snippet: string;
      [key: string]: unknown;
    }
    const topResults: OrganicResult[] = serpData?.organic_results?.slice(0, 5) || [];
    const serpText = topResults.map((r: OrganicResult, i: number) => `Result ${i + 1}:\nTitle: ${r.title}\nSnippet: ${r.snippet}`).join('\n\n');

    // GEMINI ANALYSIS ON SERP 
    const serpPrompt = `Given the following brand name, provide a detailed AI-powered brand analysis as a JSON object with these fields:
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

    Top 5 Google search results:
    ${serpText}

    If you cannot find some fields, return them as empty or null. Only return valid JSON.`;

    const serpGeminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API || ''
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: serpPrompt }] }] })
      }
    );

    const serpGeminiData = await serpGeminiRes.json().catch(() => null);
    let serpTextResponse = serpGeminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (serpTextResponse.startsWith('```')) serpTextResponse = serpTextResponse.replace(/```(json)?/g, '').trim();
    let googleSerpAnalysis = { brand_visibility: '', competitor_mentions: [], brand_sentiment: '', competitor_analysis: '' };
    try { googleSerpAnalysis = JSON.parse(serpTextResponse); } catch { }

    const responseData = {
      googleSerp: serpData,
      googleSerpAnalysis
    };

    // 3️Store in Redis with TTL 24 hours 
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 86400);
    console.log(`Cached SERP result for "${brandName}" in Redis (TTL: 24h)`);

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('API call failed:', error);
    return NextResponse.json({ error: 'API call failed', details: (error as Error)?.message || String(error) });
  }
}