import type { Metadata } from "next";
import ResearchPage from "@/components/ResearchPage";

const title = "空投 Sybil 检测：HasciDB | Adeline Wen";
const description =
  "HasciDB，最大的开源空投 Sybil 检测数据库：16 个空投、254 万个以太坊地址、五项行为指标，以及基于它的论文。Adeline Wen 在华盛顿大学 CAIS 实验室的研究。";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/zh/research", languages: { en: "/research", zh: "/zh/research", "x-default": "/research" } },
  openGraph: { title, description, url: "https://adelinewen.com/zh/research", siteName: "adelinewen.com", locale: "zh_CN", alternateLocale: "en_US", type: "article" },
  twitter: { card: "summary_large_image", creator: "@adewen7", title, description },
};

export default function Page() {
  return <ResearchPage lang="zh" />;
}
