"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function CrystalSoulPage() {
  const [loading, setLoading] = useState(false);
  const [dontKnowTime, setDontKnowTime] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      product_type: "crystal_soul",
      formData: {
        name: formData.get("name") as string,
        dob: formData.get("dob") as string,
        birthTime: dontKnowTime ? "Unknown" : (formData.get("birthTime") as string),
        birthPlace: formData.get("birthPlace") as string,
        email: formData.get("email") as string,
        crystalExperience: formData.get("crystalExperience") as string,
        intention: formData.get("intention") as string,
      },
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert("Error: " + (result.error || "No checkout URL returned"));
        setLoading(false);
      }
    } catch (err) {
      alert("Network error: " + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  }

  return (
    <main>
      <section className="min-h-screen px-6 py-20 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <Link href="/" className="text-text-secondary hover:text-text-primary text-sm mb-8 inline-block">
            ← Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold">
              Crystal Soul Report
            </h1>
            <span className="bg-gold/20 text-gold text-xs px-3 py-1 rounded-full font-semibold">NEW</span>
          </div>
          <p className="text-text-secondary mb-2">
            Discover which crystals are cosmically aligned with your birth chart — and exactly how to use them
          </p>
          <p className="text-gold font-semibold text-sm mb-8">$7.99 · Instant Delivery</p>

          {/* What You Get */}
          <div className="glass-card p-6 mb-8">
            <h3 className="font-semibold text-text-primary mb-3">What&apos;s included:</h3>
            <ul className="space-y-2 text-text-secondary text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold shrink-0">💎</span>
                <span>3-5 personalized crystal recommendations based on your unique birth chart</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold shrink-0">🔮</span>
                <span>Detailed explanation of why each crystal resonates with your planetary placements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold shrink-0">🧘</span>
                <span>How to use each crystal — meditation, wearing, and home placement guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold shrink-0">⚡</span>
                <span>Chakra alignment analysis tied to your astrological energy centers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold shrink-0">🌙</span>
                <span>Best moon phases and rituals for charging your crystals</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Name (optional)</label>
              <input
                type="text"
                name="name"
                placeholder="How should Luna address you?"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Date of Birth *</label>
              <input type="date" name="dob" required className="form-input" />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Time of Birth</label>
              <input
                type="time"
                name="birthTime"
                disabled={dontKnowTime}
                className="form-input disabled:opacity-40"
              />
              <label className="flex items-center gap-2 mt-2 text-sm text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontKnowTime}
                  onChange={(e) => setDontKnowTime(e.target.checked)}
                  className="accent-purple"
                />
                I don&apos;t know my birth time
              </label>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Place of Birth *</label>
              <input
                type="text"
                name="birthPlace"
                required
                placeholder="City, Country"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                placeholder="Where to send your report copy"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Crystal Experience</label>
              <select name="crystalExperience" className="form-input">
                <option value="beginner">New to crystals</option>
                <option value="some">I have a few crystals</option>
                <option value="collector">Avid collector</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">What are you seeking? (optional)</label>
              <textarea
                name="intention"
                rows={3}
                placeholder="e.g., emotional healing, better focus, spiritual growth, protection..."
                className="form-input resize-none"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
              {loading ? "Redirecting to payment..." : "Get Crystal Soul Report — $7.99"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
