import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import Anthropic from "@anthropic-ai/sdk";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const readingCache = new Map<string, { reading: string; product_type: string; name: string }>();

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
- Address the seeker by name if provided, otherwise use "Dear Seeker"`;

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

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: LUNA_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const reading = response.content[0].type === "text" ? response.content[0].text : "";
    const name = formData.name || formData.name1 || "";

    const result = { reading, product_type: productType, name };
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
