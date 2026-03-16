"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { ELEMENT_DATA, type Element } from "@/lib/crystals";

function ReadingContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [reading, setReading] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [element, setElement] = useState<Element | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchReading = useCallback(async () => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    try {
      // Minimum 3 seconds for ritual feel
      const [res] = await Promise.all([
        fetch(`/api/reading?session_id=${sessionId}`),
        new Promise((r) => setTimeout(r, 3000)),
      ]);

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setReading(data.reading);
        setName(data.name || "");
        setElement(data.element || null);
      }
    } catch {
      setError("Failed to load your reading. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchReading();
  }, [fetchReading]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Simple markdown-like rendering
  function renderReading(text: string) {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="font-[family-name:var(--font-heading)] text-gold text-xl md:text-2xl mt-8 mb-3">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="font-[family-name:var(--font-heading)] text-purple-light text-lg mt-6 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={i} className="text-gold-soft font-semibold mt-4 mb-2">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.trim() === "") {
        return <br key={i} />;
      }
      // Bold text inline
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="text-text-primary leading-relaxed mb-2">
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="text-gold-soft">{part.replace(/\*\*/g, "")}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
        </p>
      );
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <Image src="/luna-portrait.png" alt="Luna" width={100} height={130} className="mx-auto mb-4 rounded-2xl animate-pulse" />
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-3">
            Luna is consulting the stars for you...
          </h2>
          <p className="text-text-secondary">Your personalized reading is being crafted</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/" className="btn-outline">Return Home</Link>
        </div>
      </div>
    );
  }

  const elementData = element ? ELEMENT_DATA[element] : null;

  return (
    <>
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <p className="text-gold text-sm tracking-widest uppercase mb-4">
              ✨ Your Cosmic Reading is Ready
            </p>
            {name && (
              <p className="text-text-secondary text-lg">
                Prepared for <span className="text-text-primary font-semibold">{name}</span>
              </p>
            )}
          </div>

          {/* Reading Content */}
          <div
            className="glass-card p-8 md:p-12 animate-fade-in"
            style={{
              borderImage: "linear-gradient(135deg, rgba(107,76,154,0.5), rgba(255,215,0,0.3)) 1",
              boxShadow: "0 0 40px rgba(107,76,154,0.15)",
            }}
          >
            {reading && renderReading(reading)}
          </div>

          {/* FREE: Element Crystal Match — simple, just element + link to collection */}
          {elementData && (
            <div
              className="glass-card p-8 mt-8 animate-fade-in text-center"
              style={{
                background: "linear-gradient(135deg, rgba(26,10,46,0.6), rgba(107,76,154,0.15))",
                borderColor: elementData.color,
              }}
            >
              <div className="text-5xl mb-4">{elementData.emoji}</div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-2">
                Your Dominant Element: <span style={{ color: elementData.color }}>{elementData.element}</span>
              </h3>
              <p className="text-text-secondary mb-6 max-w-lg mx-auto">
                {elementData.freeDescription}
              </p>
              <a
                href={elementData.collectionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-block"
              >
                {elementData.buttonText} →
              </a>
              <p className="text-text-secondary/40 text-xs mt-3">
                Curated by Velora Crystal
              </p>
            </div>
          )}

          {/* PAID: Crystal Soul Report Upsell */}
          {elementData && (
            <div
              className="glass-card p-8 mt-6 animate-fade-in"
              style={{
                background: "linear-gradient(135deg, rgba(255,215,0,0.05), rgba(107,76,154,0.1))",
              }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-5xl shrink-0">💎✨</div>
                <div className="text-center md:text-left flex-1">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold">
                      Crystal Soul Report
                    </h3>
                    <span className="bg-gold/20 text-gold text-xs px-2 py-0.5 rounded-full font-semibold">
                      NEW
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">
                    Discover exactly <strong className="text-text-primary">which crystals align with your birth chart</strong> and why.
                    Get personalized crystal recommendations, chakra alignment analysis, and guidance on how to use each crystal
                    for meditation, wearing, and home placement.
                  </p>
                  <Link href="/reading/crystal-soul" className="btn-outline inline-block text-sm">
                    Get Crystal Soul Report — $7.99
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/" className="btn-gold">Get Another Reading</Link>
            <button onClick={handleShare} className="btn-outline">
              {copied ? "Link Copied!" : "Share Reading"}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center">
              <Image src="/luna-portrait.png" alt="Luna" width={100} height={130} className="mx-auto mb-4 rounded-2xl animate-pulse" />
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-3">
                Luna is consulting the stars for you...
              </h2>
              <p className="text-text-secondary">Your personalized reading is being crafted</p>
            </div>
          </div>
        }
      >
        <ReadingContent />
      </Suspense>
    </main>
  );
}
