"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const interests = [
  "Love & Relationships",
  "Career & Purpose",
  "Health & Wellness",
  "Spirituality & Growth",
  "Money & Abundance",
];

export default function BirthChartPage() {
  const [loading, setLoading] = useState(false);
  const [dontKnowTime, setDontKnowTime] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const selectedInterests = interests.filter((_, i) => formData.get(`interest_${i}`));

    const data = {
      product_type: "birth_chart",
      formData: {
        name: formData.get("name") as string,
        dob: formData.get("dob") as string,
        birthTime: dontKnowTime ? "Unknown" : (formData.get("birthTime") as string),
        birthPlace: formData.get("birthPlace") as string,
        email: formData.get("email") as string,
        interests: selectedInterests,
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
          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-2">
            Birth Chart Reading
          </h1>
          <p className="text-text-secondary mb-2">
            Share your birth details and Luna will reveal your cosmic blueprint
          </p>
          <p className="text-gold font-semibold text-sm mb-8">$9.99 · Instant Delivery</p>

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
                placeholder="Where to send your reading copy"
                className="form-input"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-3">Areas of Interest (optional)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {interests.map((interest, i) => (
                  <label key={interest} className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
                    <input type="checkbox" name={`interest_${i}`} className="accent-purple" />
                    {interest}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
              {loading ? "Redirecting to payment..." : "Proceed to Payment — $9.99"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
