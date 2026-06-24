import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://adelinewen.com", changeFrequency: "monthly", priority: 1 },
    { url: "https://adelinewen.com/zh", changeFrequency: "monthly", priority: 0.8 },
  ];
}
