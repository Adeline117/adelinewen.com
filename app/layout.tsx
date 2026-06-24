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
  title: "Adeline Wen — Software & Research",
  description:
    "Adeline Wen — CS @ University of Washington. Decentralized computing research and crafted software. One infinite loop of craft.",
  keywords: [
    "Adeline Wen",
    "software engineer",
    "decentralized computing",
    "University of Washington",
    "WebGL",
    "portfolio",
  ],
  authors: [{ name: "Adeline Wen" }],
  creator: "Adeline Wen",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Adeline Wen — Software & Research",
    description:
      "Decentralized computing research and crafted software. One infinite loop of craft.",
    url: "https://adelinewen.com",
    siteName: "adelinewen.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adeline Wen — Software & Research",
    description: "Decentralized computing research and crafted software.",
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
