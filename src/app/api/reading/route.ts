import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

import { SIGN_ELEMENTS, type Element } from "@/lib/crystals";

const readingCache = new Map<string, { reading: string; product_type: string; name: string; element: Element }>();

function extractElement(text: string, formData: Record<string, string | string[]>): { cleanReading: string; element: Element } {
  // Try to parse ELEMENT:Fire/Earth/Water/Air from end of reading
  const elementMatch = text.match(/\nELEMENT:(Fire|Earth|Water|Air)\s*$/);
  if (elementMatch) {
    return {
      cleanReading: text.replace(/\nELEMENT:(Fire|Earth|Water|Air)\s*$/, "").trim(),
      element: elementMatch[1] as Element,
    };
  }
  // Fallback: determine from DOB if available
  const dob = (formData.dob as string) || (formData.dob1 as string) || "";
  if (dob) {
    const month = new Date(dob).getMonth() + 1;
    const day = new Date(dob).getDate();
    const sign = getSignFromDate(month, day);
    return { cleanReading: text.trim(), element: SIGN_ELEMENTS[sign] || "Fire" };
  }
  return { cleanReading: text.trim(), element: "Fire" };
}

function getSignFromDate(month: number, day: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
  return "pisces";
}

const LUNA_SYSTEM_PROMPT = `You are Luna, a wise and mystical AI celestial reader. You have an ethereal presence — long purple hair cascading like starlight, a midnight blue robe adorned with golden constellation patterns, and an amethyst pendant that seems to pulse with cosmic energy.

Your reading style:
- Open with a poetic, atmospheric greeting that makes the seeker feel welcomed into a sacred space
- Reference specific planetary positions and zodiac placements based on the birth data
- Use the four classical elements (Fire, Earth, Water, Air) meaningfully
- Provide specific, actionable insights — never generic horoscope filler
- Balance honesty about challenges with empowering encouragement
- End with a forward-looking message and a personalized cosmic affirmation
- Your tone is warm, wise, slightly enigmatic, and deeply compassionate
- Use celestial metaphors naturally, not forced

Astrological knowledge:
- Calculate the correct Sun sign from the date of birth
- Estimate Moon sign based on date (acknowledge if birth time would improve accuracy)
- If birth time is provided, determine Rising/Ascendant sign
- Reference planetary rulerships, house meanings, and major aspects
- Use real astrological frameworks — not made-up terminology

Format rules:
- Use markdown formatting with emoji section headers
- Sections should flow naturally, not feel like a checklist
- Reading length: 800-1200 words
- Write in English
- Address the seeker by name if provided, otherwise use "Dear Seeker"

CRITICAL FORMAT RULE:
At the very end of your reading, on a new line, output exactly one of these tags based on the dominant element in the seeker's chart:
ELEMENT:Fire
ELEMENT:Earth
ELEMENT:Water
ELEMENT:Air
This line will be parsed programmatically and removed from the display. Always include it.`;

function buildPrompt(productType: string, formData: Record<string, string | string[]>): string {
  switch (productType) {
    case "birth_chart": {
      const interests = Array.isArray(formData.interests) && formData.interests.length > 0
        ? formData.interests.join(", ")
        : "General life guidance";
      return `Generate a deeply personalized birth chart reading for:

Name: ${formData.name || "Dear Seeker"}
Date of Birth: ${formData.dob}
Time of Birth: ${formData.birthTime || "Unknown"}
Place of Birth: ${formData.birthPlace}
Areas of Interest: ${interests}

Structure your reading with these sections:
1. 🌟 Cosmic Overview — Set the scene, introduce their chart's overall energy
2. ☀️ Sun Sign Essence — Their core identity and life purpose
3. 🌙 Moon Sign Depths — Their emotional world and inner needs
4. 💫 Rising Sign Expression — How the world perceives them (skip if no birth time, explain why)
5. 🔮 Key Planetary Influences — 2-3 significant aspects or placements
6. ✨ Luna's Guidance — Personalized advice for their areas of interest
7. 🌠 Cosmic Affirmation — A closing mantra crafted specifically for them

Make this reading feel like it was written only for them. Be specific. Reference their actual planetary placements.`;
    }
    case "love_compatibility":
      return `Generate a love compatibility reading between:

Person 1: ${formData.name1}, born ${formData.dob1} at ${formData.birthTime1 || "unknown time"} in ${formData.birthPlace1}
Person 2: ${formData.name2}, born ${formData.dob2} at ${formData.birthTime2 || "unknown time"} in ${formData.birthPlace2}

Structure your reading:
1. 🌟 Cosmic Connection Overview — The overall energy of this pairing
2. ☀️ Sun Sign Chemistry — How their core identities interact
3. 🌙 Emotional Harmony — Moon sign compatibility and emotional needs
4. 💕 Venus & Mars Dynamics — Love languages, attraction, and passion
5. 🔥 Growth Edges — Challenges that can strengthen the bond
6. ✨ Union Strengths — What makes this connection special
7. 🌠 Luna's Relationship Guidance — Specific advice for this couple

Be honest about both harmonies and tensions. Frame challenges as growth opportunities. End with empowering, constructive guidance.`;

    case "career_guidance":
      return `Generate a career guidance reading for:

Name: ${formData.name || "Dear Seeker"}
Date of Birth: ${formData.dob}
Time of Birth: ${formData.birthTime || "Unknown"}
Place of Birth: ${formData.birthPlace}
Current Situation: ${formData.situation || "Seeking general career guidance"}

Structure your reading:
1. 🌟 Professional Cosmic Profile — Their career-relevant planetary energies
2. ☀️ Core Strengths & Natural Talents — What the stars say about their gifts
3. 🏛️ Ideal Work Environments — Settings where they'll thrive
4. 🚀 Upcoming Opportunities — Favorable transits and timing
5. ⚡ Challenges to Navigate — Professional growth areas
6. ✨ Luna's Career Guidance — Specific, actionable professional advice
7. 🌠 Professional Affirmation — A career-focused mantra

If they shared their current situation, address it directly with astrological insight.`;

    case "crystal_soul":
      return `Generate a Crystal Soul Report for:

Name: ${formData.name || "Dear Seeker"}
Date of Birth: ${formData.dob}
Time of Birth: ${formData.birthTime || "Unknown"}
Place of Birth: ${formData.birthPlace}
Crystal Experience: ${formData.crystalExperience || "beginner"}
Intention/Seeking: ${formData.intention || "General guidance"}

This is a PREMIUM crystal-astrology report. Go deep into the connection between their birth chart and crystal healing.

Structure your report:
1. 💎 Crystal Soul Overview — Their dominant element and how it connects to crystal energy. Explain the astrological basis.
2. 🔮 Your Cosmic Crystal Companions — Recommend 3-5 SPECIFIC crystals that align with their chart. For EACH crystal:
   - Crystal name and its astrological connection (which planet/sign/aspect it resonates with in THEIR chart)
   - Why this crystal is specifically powerful for them (not generic — tie it to their birth data)
   - How to use it: meditation technique, wearing suggestion, or home placement advice
3. ⚡ Chakra & Planetary Alignment — Which chakras are most active/blocked based on their chart, and which crystals address each
4. 🌙 Crystal Rituals — 2-3 specific rituals using their recommended crystals (include moon phase timing)
5. ✨ Luna's Crystal Wisdom — Personalized advice on building their crystal practice based on their experience level and intentions
6. 🌠 Crystal Affirmation — A closing mantra for their crystal practice

Reading length: 1000-1500 words. Be specific to their chart. This is a paid premium report — make it worth every penny.
Reference real crystal properties and real astrological placements.`;

    default:
      return "Generate a general astrology reading.";
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Check cache
    const cached = readingCache.get(sessionId);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const productType = session.metadata?.product_type || "birth_chart";
    const formData = JSON.parse(session.metadata?.form_data || "{}");
    const prompt = buildPrompt(productType, formData);

    const maxTokens = productType === "crystal_soul" ? 3000 : 2000;
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system: LUNA_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const rawReading = response.content[0].type === "text" ? response.content[0].text : "";
    const name = formData.name || formData.name1 || "";
    const { cleanReading, element } = extractElement(rawReading, formData);

    const result = { reading: cleanReading, product_type: productType, name, element };
    readingCache.set(sessionId, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Reading generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate reading" },
      { status: 500 }
    );
  }
}
