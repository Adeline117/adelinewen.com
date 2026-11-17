import type { Metadata } from "next";
import ArenaPage from "@/components/ArenaPage";
import { getBoard } from "@/lib/arena";

const title = "Arena：加密交易者的世界排名 | Adeline Wen";
const description =
  "Arena（arenafi.org）把 44+ 家中心化和去中心化交易所的 68,000+ 名加密交易者放上同一张榜，用一个公开的 0–100 评分排名。Adeline Wen 独立开发。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/zh/arena", languages: { en: "/arena", zh: "/zh/arena", "x-default": "/arena" } },
  openGraph: { title, description, url: "https://adelinewen.com/zh/arena", siteName: "adelinewen.com", locale: "zh_CN", alternateLocale: "en_US", type: "article" },
  twitter: { card: "summary_large_image", creator: "@adewen7", title, description },
};

export default async function Page() {
  return <ArenaPage lang="zh" board={await getBoard()} />;
}
