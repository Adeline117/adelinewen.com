import Site from "@/components/Site";
import { getBoard } from "@/lib/arena";

export default async function Home() {
  return <Site routeLang="en" board={await getBoard()} />;
}
