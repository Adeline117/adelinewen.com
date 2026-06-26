import type { Metadata } from "next";
import Site from "@/components/Site";

export const metadata: Metadata = {
  title: "Adeline Wen — 研究者与构建者",
  description:
    "Adeline Wen — 华盛顿大学去中心化计算实验室本科研究助理，arenafi.org 独立创始人。区块链与去中心化 AI 研究、空投 Sybil 检测，以及首个独立打造的跨平台加密交易者排名。",
  alternates: { canonical: "/zh", languages: { en: "/", zh: "/zh" } },
};

export default function ZhHome() {
  return <Site routeLang="zh" />;
}
