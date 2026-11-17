import type { MetadataRoute } from "next";
import { GALLERY } from "@/components/gallery";
import { WALL } from "@/components/wall";

const SITE = "https://adelinewen.com";

// Both language versions, each pointing at the other (hreflang), stamped with the build
// time so crawlers see when the content last changed, and listing every photo on the
// page so they can be found in image search.
const images = [
  ...Object.values(GALLERY).flatMap((shots) => shots.map((s) => `${SITE}${s.src}`)),
  ...WALL.flat().map(([n]) => `${SITE}/photos/stage/wall/${String(n).padStart(2, "0")}-480.webp`),
  `${SITE}/opengraph-image`,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const languages = { en: SITE, zh: `${SITE}/zh` };
  return [
    { url: SITE, lastModified, changeFrequency: "weekly", priority: 1, alternates: { languages }, images },
    { url: `${SITE}/zh`, lastModified, changeFrequency: "weekly", priority: 0.8, alternates: { languages }, images },
  ];
}
