import { OG_SIZE, arenaCard } from "@/lib/og";

export const alt = "Arena, crypto's world ranking: the top of the live leaderboard";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return arenaCard();
}
