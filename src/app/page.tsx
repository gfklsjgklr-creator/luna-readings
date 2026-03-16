"use client";

import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/Footer";

const services = [
  {
    icon: "☀️",
    title: "Birth Chart Reading",
    price: "$9.99",
    description:
      "A deep dive into your cosmic blueprint. Discover your Sun, Moon, and Rising signs, key planetary aspects, and personalized guidance for your life path.",
    tag: "Most Popular",
    button: "Get Reading →",
    href: "/reading/birth-chart",
  },
  {
    icon: "💕",
    title: "Love Compatibility",
    price: "$14.99",
    description:
      "Explore the celestial chemistry between two souls. Understand your emotional harmony, passion dynamics, and growth potential as a couple.",
    tag: null,
    button: "Check Compatibility →",
    href: "/reading/love",
  },
  {
    icon: "🚀",
    title: "Career Guidance",
    price: "$12.99",
    description:
      "Align your professional path with cosmic wisdom. Discover your natural strengths, ideal work environments, and upcoming opportunities.",
    tag: null,
    button: "Get Career Reading →",
    href: "/reading/career",
  },
  {
    icon: "🌙",
    title: "Daily Horoscope",
    price: "FREE",
    description:
      "Your daily dose of celestial guidance. Select your zodiac sign and receive Luna's insights for today.",
    tag: "Free",
    button: "Read Today's Horoscope →",
    href: "/reading/daily",
  },
];

const steps = [
  {
    num: "1",
    title: "Share Your Birth Details",
    desc: "Enter your date, time, and place of birth. The more details you provide, the more personalized your reading.",
  },
  {
    num: "2",
    title: "Luna Consults The Stars",
    desc: "Our AI celestial reader analyzes your unique planetary positions, aspects, and cosmic alignments.",
  },
  {
    num: "3",
    title: "Receive Your Reading",
    desc: "Get an in-depth, beautifully formatted reading delivered instantly. Save it, share it, or return to it anytime.",
  },
];

const testimonials = [
  {
    quote:
      "Luna's birth chart reading was incredibly detailed and accurate. It felt like she truly understood my cosmic blueprint.",
    name: "Sarah M.",
    sign: "♈ Aries",
  },
  {
    quote:
      "The love compatibility reading helped me understand the dynamics in my relationship on a deeper level. Worth every penny.",
    name: "James K.",
    sign: "♏ Scorpio",
  },
  {
    quote:
      "I was skeptical about AI astrology, but Luna's career reading gave me actionable insights I hadn't considered. Truly impressed.",
    name: "Priya R.",
    sign: "♒ Aquarius",
  },
];

const faqs = [
  {
    q: "What is an AI astrology reading?",
    a: "Luna uses advanced AI combined with real astrological knowledge to generate deeply personalized readings based on your actual birth chart data. Each reading is unique to you — never generic, never recycled.",
  },
  {
    q: "How accurate are Luna's readings?",
    a: "Luna calculates real planetary positions based on your birth data and interprets them using established astrological principles. While astrology itself is a matter of personal belief, our readings are astrologically accurate and consistently praised for their depth and relevance.",
  },
  {
    q: "How long does it take to receive my reading?",
    a: "Your reading is generated instantly after payment. Most readings are ready within 30-60 seconds.",
  },
  {
    q: "Is my birth data private?",
    a: "Absolutely. Your birth data is used only to generate your reading and is never stored, shared, or sold. We take privacy seriously.",
  },
  {
    q: "Can I get a refund?",
    a: "Due to the digital nature of our readings, we don't offer refunds. However, if you're unsatisfied, contact us and we'll work to make it right.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-card p-5 cursor-pointer" onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-text-primary">{q}</h3>
        <span className="text-gold text-xl ml-4 shrink-0">{open ? "−" : "+"}</span>
      </div>
      {open && <p className="mt-3 text-text-secondary leading-relaxed">{a}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-6 py-20 text-center">
        <div className="max-w-3xl">
          <span className="inline-block text-gold-soft text-sm tracking-widest uppercase mb-6">
            ✨ AI-Powered Celestial Guidance
          </span>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-6xl font-bold leading-tight mb-6">
            Discover What The Stars Reveal About Your Path
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Luna is an AI celestial reader who creates deeply personalized astrology readings based
            on your unique birth chart.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/reading/birth-chart" className="btn-gold text-lg">
              Get Your Birth Chart Reading — $9.99
            </Link>
            <Link href="/reading/daily" className="btn-outline">
              Try Free Daily Horoscope
            </Link>
          </div>
          <p className="text-text-secondary/60 text-sm">
            Trusted by seekers worldwide · Instant delivery · 100% personalized
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-center mb-14">
          Choose Your Celestial Reading
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.title} className="glass-card p-8 flex flex-col relative">
              {s.tag && (
                <span className="absolute top-4 right-4 bg-gold/20 text-gold text-xs px-3 py-1 rounded-full font-semibold">
                  {s.tag}
                </span>
              )}
              <span className="text-4xl mb-4">{s.icon}</span>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-1">
                {s.title}
              </h3>
              <p className="text-gold font-semibold mb-3">{s.price}</p>
              <p className="text-text-secondary leading-relaxed mb-6 flex-1">{s.description}</p>
              <Link
                href={s.href}
                className={s.price === "FREE" ? "btn-outline w-full" : "btn-gold w-full"}
              >
                {s.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* How It Works */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-center mb-14">
          How Luna Reads The Stars For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-14 h-14 rounded-full bg-purple/20 border border-purple/40 flex items-center justify-center text-gold font-bold text-xl mx-auto mb-5">
                {step.num}
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* Testimonials */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-center mb-14">
          What Seekers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-8">
              <p className="text-text-primary leading-relaxed italic mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple/30 flex items-center justify-center text-gold font-bold">
                  {t.sign.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-text-secondary text-xs">{t.sign}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* FAQ */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-center mb-14">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* CTA */}
      <section className="px-6 py-20">
        <div
          className="max-w-3xl mx-auto text-center glass-card p-12"
          style={{
            background:
              "linear-gradient(135deg, rgba(107,76,154,0.2), rgba(26,10,46,0.8))",
          }}
        >
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Your Cosmic Blueprint?
          </h2>
          <p className="text-text-secondary mb-8 text-lg">
            Join thousands of seekers who have uncovered their celestial path with Luna.
          </p>
          <Link href="/reading/birth-chart" className="btn-gold text-lg">
            Get Your Reading Now — $9.99
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
