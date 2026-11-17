import type { Metadata } from "next";
import ArenaPage from "@/components/ArenaPage";
import { getBoard } from "@/lib/arena";

const title = "Arena: A World Ranking for Crypto Traders | Adeline Wen";
const description =
  "Arena (arenafi.org) ranks 68,000+ crypto traders from 44+ centralized and decentralized exchanges on one board, by a single public 0–100 score. Built solo by Adeline Wen.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/arena", languages: { en: "/arena", zh: "/zh/arena", "x-default": "/arena" } },
  openGraph: { title, description, url: "https://adelinewen.com/arena", siteName: "adelinewen.com", locale: "en_US", alternateLocale: "zh_CN", type: "article" },
  twitter: { card: "summary_large_image", creator: "@adewen7", title, description },
};

export default async function Page() {
  return <ArenaPage lang="en" board={await getBoard()} />;
}
