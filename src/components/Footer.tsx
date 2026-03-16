import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-purple/20 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-text-secondary text-sm">
        <p>&copy; 2026 Luna AI Celestial Readings. Part of the Velora Crystal family.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-text-primary transition-colors">
            Terms of Service
          </Link>
          <a href="mailto:veloracrystal.official@gmail.com" className="hover:text-text-primary transition-colors">
            Contact
          </a>
        </div>
        <a
          href="https://veloracrystal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gold transition-colors"
        >
          Visit Velora Crystal &rarr;
        </a>
      </div>
      <p className="text-center text-text-secondary/60 text-xs mt-6 max-w-3xl mx-auto">
        Luna is an AI astrologer. Readings are for entertainment and self-reflection purposes only.
        Not a substitute for professional advice.
      </p>
    </footer>
  );
}
