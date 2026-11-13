import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz"], // optical size: display cuts tighten, text sizes open up
});

// Chinese serif behind Fraunces: Noto Serif SC cut to the ~480 hanzi the site
// uses (scripts/subset-cjk.py, ~150 KB). Not preloaded — the English page never
// renders a hanzi in the serif, so it never downloads this file.
const cjk = localFont({
  src: "./fonts/noto-serif-sc-subset.woff2",
  variable: "--font-cjk",
  weight: "300 600",
  preload: false,
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adelinewen.com"),
  title: "Adeline Wen | Researcher & Builder",
  description:
    "Adeline Wen, undergraduate research assistant at the UW CAIS Lab and solo founder of arenafi.org. Blockchain and decentralized-AI research, airdrop Sybil detection, and Arena, a ranking of crypto traders across exchanges.",
  keywords: [
    "Adeline Wen",
    "blockchain research",
    "decentralized AI",
    "decentralized computing",
    "airdrop Sybil detection",
    "HasciDB",
    "Arena",
    "arenafi.org",
    "crypto trader rankings",
    "University of Washington",
  ],
  authors: [{ name: "Adeline Wen" }],
  creator: "Adeline Wen",
  alternates: { canonical: "/", languages: { en: "/", zh: "/zh", "x-default": "/" } },
  openGraph: {
    title: "Adeline Wen | Researcher & Builder",
    description:
      "UW CAIS Lab · solo founder of arenafi.org · blockchain and decentralized-AI research.",
    url: "https://adelinewen.com",
    siteName: "adelinewen.com",
    locale: "en_US",
    alternateLocale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adeline Wen | Researcher & Builder",
    description: "UW CAIS Lab · solo founder of arenafi.org · blockchain & decentralized-AI research.",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#f7f5f1",
};

// Always opens on light paper; dark only when the visitor has chosen it with the toggle
// (the OS scheme is not followed, so the page never changes on its own).
const noFlash = `try{localStorage.removeItem('theme');if(localStorage.getItem('theme-pick')==='dark')document.body.classList.add('dark');if(location.pathname.indexOf('/zh')===0)document.documentElement.lang='zh';}catch(e){}`;

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Adeline Wen",
  url: "https://adelinewen.com",
  jobTitle: "Researcher & Builder",
  affiliation: { "@type": "Organization", name: "University of Washington" },
  sameAs: [
    "https://github.com/Adeline117",
    "https://www.linkedin.com/in/adeline1107",
    "https://arenafi.org",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fraunces.variable} ${cjk.variable} ${mono.variable}`}>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
