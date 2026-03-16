import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Starfield } from "@/components/Starfield";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luna AI Celestial Readings — Discover What The Stars Reveal",
  description:
    "Luna is an AI celestial reader who creates deeply personalized astrology readings based on your unique birth chart. Birth chart, love compatibility, career guidance, and free daily horoscopes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <Starfield />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
