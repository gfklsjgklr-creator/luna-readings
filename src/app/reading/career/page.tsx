"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function CareerPage() {
  const [loading, setLoading] = useState(false);
  const [dontKnowTime, setDontKnowTime] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const data = {
      product_type: "career_guidance",
      formData: {
        name: fd.get("name") as string,
        dob: fd.get("dob") as string,
        birthTime: dontKnowTime ? "Unknown" : (fd.get("birthTime") as string),
        birthPlace: fd.get("birthPlace") as string,
        situation: fd.get("situation") as string,
        email: fd.get("email") as string,
      },
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Something went wrong. Please try again.");
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
            Career Guidance Reading
          </h1>
          <p className="text-text-secondary mb-2">
            Align your professional path with cosmic wisdom
          </p>
          <p className="text-gold font-semibold text-sm mb-8">$12.99 · Instant Delivery</p>

          <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-5">
            <div>
              <label className="block text-sm text-text-secondary mb-2">Name (optional)</label>
              <input type="text" name="name" placeholder="How should Luna address you?" className="form-input" />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Date of Birth *</label>
              <input type="date" name="dob" required className="form-input" />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Time of Birth</label>
              <input type="time" name="birthTime" disabled={dontKnowTime} className="form-input disabled:opacity-40" />
              <label className="flex items-center gap-2 mt-2 text-sm text-text-secondary cursor-pointer">
                <input type="checkbox" checked={dontKnowTime} onChange={(e) => setDontKnowTime(e.target.checked)} className="accent-purple" />
                I don&apos;t know my birth time
              </label>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Place of Birth *</label>
              <input type="text" name="birthPlace" required placeholder="City, Country" className="form-input" />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Current Situation (optional)</label>
              <textarea
                name="situation"
                placeholder="Briefly describe your current career situation or question"
                maxLength={500}
                rows={3}
                className="form-input resize-none"
              />
              <p className="text-text-secondary/50 text-xs mt-1">Max 500 characters</p>
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">Email *</label>
              <input type="email" name="email" required placeholder="Where to send your reading copy" className="form-input" />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
              {loading ? "Redirecting to payment..." : "Proceed to Payment — $12.99"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
