import type { Metadata } from "next";
import Site from "@/components/Site";
import { getBoard } from "@/lib/arena";

export const metadata: Metadata = {
  title: "Adeline Wen | 研究者与构建者",
  description:
    "Adeline Wen, 华盛顿大学 CAIS 实验室本科研究助理，arenafi.org 独立创始人。研究区块链、去中心化 AI 和空投 Sybil 检测，做了跨交易所的加密交易者排名 Arena。",
  alternates: { canonical: "/zh", languages: { en: "/", zh: "/zh", "x-default": "/" } },
  openGraph: {
    title: "Adeline Wen | 研究者与构建者",
    description:
      "华盛顿大学 CAIS 实验室本科研究助理，arenafi.org 独立创始人。区块链与去中心化 AI 研究。",
    url: "https://adelinewen.com/zh",
    siteName: "adelinewen.com",
    locale: "zh_CN",
    alternateLocale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adeline Wen | 研究者与构建者",
    description: "华盛顿大学 CAIS 实验室研究助理，arenafi.org 独立创始人。",
  },
};

export default async function ZhHome() {
  return <Site routeLang="zh" board={await getBoard()} />;
}
