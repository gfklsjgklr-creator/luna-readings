"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/Footer";

function ReadingContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [reading, setReading] = useState<string | null>(null);
  const [name, setName] = useState("");
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
          <div className="text-6xl animate-spin-slow inline-block mb-6">✨</div>
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

          <div
            className="glass-card p-8 md:p-12 animate-fade-in"
            style={{
              borderImage: "linear-gradient(135deg, rgba(107,76,154,0.5), rgba(255,215,0,0.3)) 1",
              boxShadow: "0 0 40px rgba(107,76,154,0.15)",
            }}
          >
            {reading && renderReading(reading)}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/" className="btn-gold">Get Another Reading</Link>
            <a
              href="https://veloracrystal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Visit Velora Crystal
            </a>
            <button onClick={handleShare} className="btn-outline">
              {copied ? "Link Copied!" : "Share"}
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
              <div className="text-6xl animate-spin-slow inline-block mb-6">✨</div>
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
