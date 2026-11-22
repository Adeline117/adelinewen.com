import type { Metadata } from "next";
import BenRain from "@/components/BenRain";

// adelinewen.com/ben: a photo of Ben, in 0s and 1s and hearts. Personal, so kept out of
// search and off the sitemap.
export const metadata: Metadata = {
  title: "Ben",
  robots: { index: false, follow: false },
};

export default function Ben() {
  return <BenRain />;
}
