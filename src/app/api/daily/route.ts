import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const dailyCache = new Map<string, string>();

import { SIGN_ELEMENTS } from "@/lib/crystals";

const SIGN_NAMES: Record<string, string> = {
  aries: "Aries",
  taurus: "Taurus",
  gemini: "Gemini",
  cancer: "Cancer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  scorpio: "Scorpio",
  sagittarius: "Sagittarius",
  capricorn: "Capricorn",
  aquarius: "Aquarius",
  pisces: "Pisces",
};

export async function GET(request: NextRequest) {
  try {
    const sign = request.nextUrl.searchParams.get("sign");
    if (!sign || !SIGN_NAMES[sign]) {
      return NextResponse.json({ error: "Invalid zodiac sign" }, { status: 400 });
    }

    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `daily_${sign}_${today}`;

    const cached = dailyCache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ horoscope: cached, sign, date: today });
    }

    const signName = SIGN_NAMES[sign];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      system: "You are Luna, a mystical AI astrologer. Write a brief daily horoscope.",
      messages: [
        {
          role: "user",
          content: `Write today's horoscope for ${signName} (${today}).

Keep it concise (150-200 words) and include:
- 🔮 Energy of the Day: One keyword or phrase
- Today's guidance: 2-3 specific, actionable sentences about what to expect and how to navigate the day
- Lucky Color & Number
- ✨ Luna's Daily Mantra: One empowering sentence

Be specific and insightful, not generic. Write as Luna — warm, wise, slightly mysterious.
End with a subtle hint: "Want to go deeper? Your full birth chart reading reveals so much more about your cosmic path."`,
        },
      ],
    });

    const horoscope = response.content[0].type === "text" ? response.content[0].text : "";
    dailyCache.set(cacheKey, horoscope);

    const element = SIGN_ELEMENTS[sign] || "Fire";
    return NextResponse.json({ horoscope, sign, date: today, element });
  } catch (error) {
    console.error("Daily horoscope error:", error);
    return NextResponse.json(
      { error: "Failed to generate horoscope" },
      { status: 500 }
    );
  }
}
