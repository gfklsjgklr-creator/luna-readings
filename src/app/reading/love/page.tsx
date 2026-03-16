"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function LovePage() {
  const [loading, setLoading] = useState(false);
  const [dontKnowTime1, setDontKnowTime1] = useState(false);
  const [dontKnowTime2, setDontKnowTime2] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const data = {
      product_type: "love_compatibility",
      formData: {
        name1: fd.get("name1") as string,
        dob1: fd.get("dob1") as string,
        birthTime1: dontKnowTime1 ? "Unknown" : (fd.get("birthTime1") as string),
        birthPlace1: fd.get("birthPlace1") as string,
        name2: fd.get("name2") as string,
        dob2: fd.get("dob2") as string,
        birthTime2: dontKnowTime2 ? "Unknown" : (fd.get("birthTime2") as string),
        birthPlace2: fd.get("birthPlace2") as string,
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
            Love Compatibility Reading
          </h1>
          <p className="text-text-secondary mb-2">
            Discover the celestial chemistry between two souls
          </p>
          <p className="text-gold font-semibold text-sm mb-8">$14.99 · Instant Delivery</p>

          <form onSubmit={handleSubmit} className="glass-card p-8 flex flex-col gap-6">
            {/* Person 1 */}
            <div>
              <h3 className="text-gold font-semibold mb-4">Person 1</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Name *</label>
                  <input type="text" name="name1" required className="form-input" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Date of Birth *</label>
                  <input type="date" name="dob1" required className="form-input" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Time of Birth</label>
                  <input type="time" name="birthTime1" disabled={dontKnowTime1} className="form-input disabled:opacity-40" />
                  <label className="flex items-center gap-2 mt-2 text-sm text-text-secondary cursor-pointer">
                    <input type="checkbox" checked={dontKnowTime1} onChange={(e) => setDontKnowTime1(e.target.checked)} className="accent-purple" />
                    I don&apos;t know the birth time
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Place of Birth *</label>
                  <input type="text" name="birthPlace1" required placeholder="City, Country" className="form-input" />
                </div>
              </div>
            </div>

            <div className="section-divider !my-0" />

            {/* Person 2 */}
            <div>
              <h3 className="text-gold font-semibold mb-4">Person 2</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Name *</label>
                  <input type="text" name="name2" required className="form-input" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Date of Birth *</label>
                  <input type="date" name="dob2" required className="form-input" />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Time of Birth</label>
                  <input type="time" name="birthTime2" disabled={dontKnowTime2} className="form-input disabled:opacity-40" />
                  <label className="flex items-center gap-2 mt-2 text-sm text-text-secondary cursor-pointer">
                    <input type="checkbox" checked={dontKnowTime2} onChange={(e) => setDontKnowTime2(e.target.checked)} className="accent-purple" />
                    I don&apos;t know the birth time
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Place of Birth *</label>
                  <input type="text" name="birthPlace2" required placeholder="City, Country" className="form-input" />
                </div>
              </div>
            </div>

            <div className="section-divider !my-0" />

            <div>
              <label className="block text-sm text-text-secondary mb-2">Email *</label>
              <input type="email" name="email" required placeholder="Where to send your reading copy" className="form-input" />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2 disabled:opacity-50">
              {loading ? "Redirecting to payment..." : "Proceed to Payment — $14.99"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
