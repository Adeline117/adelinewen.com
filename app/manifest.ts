import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adeline Wen — Researcher & Builder",
    short_name: "Adeline Wen",
    description: "Decentralized computing research and crafted software.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0a14",
    theme_color: "#0c0a14",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
