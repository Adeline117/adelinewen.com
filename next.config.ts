import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The childhood photo wall stays on the page but out of search: these 83 images are
  // kept from image-search indexes. The curated stage reel (/photos/stage/*.jpg) is not.
  async headers() {
    return [
      {
        source: "/photos/stage/wall/:file*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, noimageindex" }],
      },
    ];
  },
};

export default nextConfig;
