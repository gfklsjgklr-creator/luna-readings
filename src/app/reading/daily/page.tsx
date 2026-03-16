"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const signs = [
  { symbol: "♈", name: "Aries", key: "aries" },
  { symbol: "♉", name: "Taurus", key: "taurus" },
  { symbol: "♊", name: "Gemini", key: "gemini" },
  { symbol: "♋", name: "Cancer", key: "cancer" },
  { symbol: "♌", name: "Leo", key: "leo" },
  { symbol: "♍", name: "Virgo", key: "virgo" },
  { symbol: "♎", name: "Libra", key: "libra" },
  { symbol: "♏", name: "Scorpio", key: "scorpio" },
  { symbol: "♐", name: "Sagittarius", key: "sagittarius" },
  { symbol: "♑", name: "Capricorn", key: "capricorn" },
  { symbol: "♒", name: "Aquarius", key: "aquarius" },
  { symbol: "♓", name: "Pisces", key: "pisces" },
];

export default function DailyPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchHoroscope(sign: string) {
    setSelected(sign);
    setHoroscope(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/daily?sign=${sign}`);
      const data = await res.json();
      setHoroscope(data.horoscope);
    } catch {
      setHoroscope("Unable to read the stars right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const selectedSign = signs.find((s) => s.key === selected);

  return (
    <main>
      <section className="min-h-screen px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-text-secondary hover:text-text-primary text-sm mb-8 inline-block">
            ← Back to Home
          </Link>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-2 text-center">
            Daily Horoscope by Luna
          </h1>
          <p className="text-text-secondary text-center mb-12">
            Select your zodiac sign for today&apos;s celestial guidance
          </p>

          {/* Zodiac grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-12">
            {signs.map((sign) => (
              <button
                key={sign.key}
                onClick={() => fetchHoroscope(sign.key)}
                className={`glass-card p-4 text-center transition-all cursor-pointer ${
                  selected === sign.key
                    ? "!border-gold !bg-gold/10"
                    : "hover:border-purple-light"
                }`}
              >
                <span className="text-3xl block mb-1">{sign.symbol}</span>
                <span className="text-sm font-medium">{sign.name}</span>
              </button>
            ))}
          </div>

          {/* Horoscope display */}
          {loading && (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl animate-spin-slow inline-block mb-4">✨</div>
              <p className="text-text-secondary">
                Luna is reading the stars for {selectedSign?.name}...
              </p>
            </div>
          )}

          {horoscope && !loading && (
            <div className="glass-card p-8 animate-fade-in">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-gold mb-4">
                {selectedSign?.symbol} {selectedSign?.name} — Today&apos;s Horoscope
              </h2>
              <div className="text-text-primary leading-relaxed whitespace-pre-line">
                {horoscope}
              </div>
            </div>
          )}

          {/* CTA */}
          {horoscope && !loading && (
            <div className="glass-card p-8 mt-8 text-center" style={{ background: "linear-gradient(135deg, rgba(107,76,154,0.15), rgba(26,10,46,0.6))" }}>
              <p className="text-text-primary font-semibold mb-2">
                Your daily horoscope only scratches the surface.
              </p>
              <p className="text-text-secondary mb-6">
                Get your full Birth Chart Reading for a deep dive into your cosmic blueprint.
              </p>
              <Link href="/reading/birth-chart" className="btn-gold">
                Get Full Reading — $9.99
              </Link>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
