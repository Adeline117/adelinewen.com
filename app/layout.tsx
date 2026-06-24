import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adelinewen.com"),
  title: "Adeline Wen — Researcher & Builder",
  description:
    "Adeline Wen — undergraduate researcher at the UW Decentralized Computing Lab and builder of arenafi.org. Airdrop Sybil detection, decentralized systems, and crafted software.",
  keywords: [
    "Adeline Wen",
    "decentralized computing",
    "airdrop Sybil detection",
    "HasciDB",
    "Arena arenafi",
    "University of Washington",
    "blockchain research",
    "portfolio",
  ],
  authors: [{ name: "Adeline Wen" }],
  creator: "Adeline Wen",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Adeline Wen — Researcher & Builder",
    description:
      "UW Decentralized Computing Lab · builder of arenafi.org · airdrop Sybil detection. One infinite loop of craft.",
    url: "https://adelinewen.com",
    siteName: "adelinewen.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adeline Wen — Researcher & Builder",
    description: "UW Decentralized Computing Lab · builder of arenafi.org · Sybil detection.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1efe8" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a14" },
  ],
};

const noFlash = `try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.body.classList.add('dark');}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${mono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
        {children}
      </body>
    </html>
  );
}
