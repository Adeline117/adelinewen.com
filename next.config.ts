import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // a paper renamed to the site's one scheme (FirstAuthorYear-Short-Venue.pdf) keeps its old address
  async redirects() {
    return [{ source: "/papers/hascidb-nbc26.pdf", destination: "/papers/Wen2026-HasciDB-NBC.pdf", permanent: true }];
  },
  // Image search shows only three photos: the landscape stage shots in red (03), pink (18)
  // and purple (01). Every other photo and the generated share cards stay on the page and
  // in link previews, but out of image-search indexes. (When two rules set the same header
  // the later one wins, so the three are allowed after the blanket rule.)
  async headers() {
    const hide = [{ key: "X-Robots-Tag", value: "noindex, noimageindex" }];
    return [
      { source: "/photos/:path*", headers: hide },
      { source: "/opengraph-image", headers: hide },
      { source: "/:path*/opengraph-image", headers: hide },
      { source: "/photos/stage/:file((?:01|03|18)(?:-\\d+\\.(?:avif|webp)|\\.jpg))", headers: [{ key: "X-Robots-Tag", value: "all" }] },
    ];
  },
};

export default nextConfig;
