import type { Metadata, Viewport } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
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

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adelinewen.com"),
  title: "Adeline Wen | Researcher & Builder",
  description:
    "Adeline Wen, undergraduate research assistant at the UW Decentralized Computing Lab and solo founder of arenafi.org. Blockchain and decentralized-AI research, airdrop Sybil detection, and the first cross-platform crypto trader ranking, built end-to-end.",
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
      "UW Decentralized Computing Lab · solo founder of arenafi.org · blockchain and decentralized-AI research. One infinite loop of craft.",
    url: "https://adelinewen.com",
    siteName: "adelinewen.com",
    locale: "en_US",
    alternateLocale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adeline Wen | Researcher & Builder",
    description: "UW Decentralized Computing Lab · solo founder of arenafi.org · blockchain & decentralized-AI research.",
    creator: "@AdelineWen07",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

// Default to light (Swiss paper is the primary face); a saved choice still wins.
const noFlash = `try{var t=localStorage.getItem('theme');if(t==='dark')document.body.classList.add('dark');if(location.pathname.indexOf('/zh')===0)document.documentElement.lang='zh';}catch(e){}`;

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
    "https://x.com/AdelineWen07",
    "https://www.instagram.com/adelinew07/",
    "https://arenafi.org",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${mono.variable}`}>
      <body>
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
