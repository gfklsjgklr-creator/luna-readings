"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { ELEMENT_DATA, type Element } from "@/lib/crystals";

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
  const [element, setElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchHoroscope(sign: string) {
    setSelected(sign);
    setHoroscope(null);
    setElement(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/daily?sign=${sign}`);
      const data = await res.json();
      setHoroscope(data.horoscope);
      setElement(data.element || null);
    } catch {
      setHoroscope("Unable to read the stars right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const selectedSign = signs.find((s) => s.key === selected);
  const elementData = element ? ELEMENT_DATA[element] : null;

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

          {/* FREE: Element Crystal Match */}
          {horoscope && !loading && elementData && (
            <div
              className="glass-card p-6 mt-6 animate-fade-in flex flex-col sm:flex-row items-center gap-4"
              style={{
                background: "linear-gradient(135deg, rgba(26,10,46,0.6), rgba(107,76,154,0.1))",
              }}
            >
              <div className="text-4xl shrink-0">{elementData.emoji}</div>
              <div className="text-center sm:text-left flex-1">
                <p className="text-text-primary font-semibold text-sm mb-1">
                  {selectedSign?.name} is a <span style={{ color: elementData.color }}>{elementData.element}</span> sign
                </p>
                <p className="text-text-secondary text-sm mb-3">
                  {elementData.freeDescription}
                </p>
                <a
                  href={elementData.collectionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-sm font-semibold hover:underline"
                >
                  {elementData.buttonText} →
                </a>
              </div>
            </div>
          )}

          {/* CTA: Birth Chart + Crystal Soul */}
          {horoscope && !loading && (
            <div className="glass-card p-8 mt-6 text-center" style={{ background: "linear-gradient(135deg, rgba(107,76,154,0.15), rgba(26,10,46,0.6))" }}>
              <p className="text-text-primary font-semibold mb-2">
                Your daily horoscope only scratches the surface.
              </p>
              <p className="text-text-secondary mb-6">
                Go deeper with a personalized reading based on your full birth chart.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/reading/birth-chart" className="btn-gold">
                  Birth Chart Reading — $9.99
                </Link>
                <Link href="/reading/crystal-soul" className="btn-outline">
                  Crystal Soul Report — $7.99
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
