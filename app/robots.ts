import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://adelinewen.com/sitemap.xml",
    host: "https://adelinewen.com",
  };
}
