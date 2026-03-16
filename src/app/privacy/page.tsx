import Link from "next/link";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main>
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <Link href="/" className="text-text-secondary hover:text-text-primary text-sm mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-8">
          Privacy Policy
        </h1>
        <div className="glass-card p-8 md:p-12 text-text-secondary leading-relaxed space-y-6">
          <p><strong className="text-text-primary">Last Updated:</strong> March 2026</p>

          <h2 className="font-[family-name:var(--font-heading)] text-xl text-text-primary mt-6">Information We Collect</h2>
          <p>
            When you use Luna AI Celestial Readings, we collect the following information to generate your personalized reading:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Name (optional, used to personalize your reading)</li>
            <li>Email address (used to identify your purchase)</li>
            <li>Date, time, and place of birth (used solely to generate your astrological reading)</li>
          </ul>

          <h2 className="font-[family-name:var(--font-heading)] text-xl text-text-primary mt-6">Payment Processing</h2>
          <p>
            All payments are processed securely by Stripe. We do not store, collect, or have access to your credit card information or other payment details. Please refer to{" "}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-purple-light hover:text-text-primary underline">
              Stripe&apos;s Privacy Policy
            </a>{" "}
            for details on how they handle payment data.
          </p>

          <h2 className="font-[family-name:var(--font-heading)] text-xl text-text-primary mt-6">How We Use Your Data</h2>
          <p>
            Your birth data is used exclusively to generate your personalized astrological reading. We do not permanently store your birth data after your reading has been generated. Your reading may be temporarily cached to allow you to revisit the results page.
          </p>

          <h2 className="font-[family-name:var(--font-heading)] text-xl text-text-primary mt-6">Data Sharing</h2>
          <p>
            We do not sell, trade, or share your personal data with any third parties. Your birth data is sent to our AI provider (Anthropic) solely for the purpose of generating your reading and is subject to their data processing policies.
          </p>

          <h2 className="font-[family-name:var(--font-heading)] text-xl text-text-primary mt-6">Cookies</h2>
          <p>
            We use only essential cookies required for the functioning of our website. We do not use tracking cookies or third-party analytics cookies.
          </p>

          <h2 className="font-[family-name:var(--font-heading)] text-xl text-text-primary mt-6">Contact</h2>
          <p>
            If you have questions about this privacy policy or your data, please contact us at{" "}
            <a href="mailto:veloracrystal.official@gmail.com" className="text-purple-light hover:text-text-primary underline">
              veloracrystal.official@gmail.com
            </a>.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
