import type { Metadata } from "next";
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
  openGraph: {
    title: "Adeline Wen — Software & Research",
    description:
      "Decentralized computing research and crafted software. One infinite loop of craft.",
    url: "https://adelinewen.com",
    siteName: "adelinewen.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
