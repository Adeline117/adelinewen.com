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
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
