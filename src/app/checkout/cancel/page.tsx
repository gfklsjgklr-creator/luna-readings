import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function CheckoutCancelPage() {
  return (
    <main>
      <section className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card p-12 text-center max-w-md">
          <div className="text-5xl mb-6">🌙</div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold mb-4">
            Payment was cancelled
          </h1>
          <p className="text-text-secondary mb-8">
            No worries — the stars will wait for you.
          </p>
          <Link href="/" className="btn-gold">
            Return Home
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
