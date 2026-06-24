import type { Metadata } from "next";
import Site from "@/components/Site";

export const metadata: Metadata = {
  title: "Adeline Wen — 研究者与构建者",
  description:
    "Adeline Wen — 华盛顿大学去中心化计算实验室本科研究员，arenafi.org 创造者。空投 Sybil 检测、去中心化系统与精致软件。",
  alternates: { canonical: "/zh", languages: { en: "/", zh: "/zh" } },
};

export default function ZhHome() {
  return <Site routeLang="zh" />;
}
