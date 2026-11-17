import type { Metadata } from "next";
import ResearchPage from "@/components/ResearchPage";

const title = "Airdrop Sybil Detection: HasciDB | Adeline Wen";
const description =
  "HasciDB, the largest open-source airdrop Sybil detection database: 2.54 million Ethereum addresses across 16 airdrops, five behavioural indicators, and the papers built on it. Research by Adeline Wen at the UW CAIS Lab.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/research", languages: { en: "/research", zh: "/zh/research", "x-default": "/research" } },
  openGraph: { title, description, url: "https://adelinewen.com/research", siteName: "adelinewen.com", locale: "en_US", alternateLocale: "zh_CN", type: "article" },
  twitter: { card: "summary_large_image", creator: "@adewen7", title, description },
};

export default function Page() {
  return <ResearchPage lang="en" />;
}
