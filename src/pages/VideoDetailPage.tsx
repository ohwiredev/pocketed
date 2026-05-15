import { useMeta } from "@/hooks/useMeta";
import { useTitle } from "@/hooks/useTitle";

export default function VideoDetailPage() {
  useTitle("Video Details");
  useMeta({
    description:
      "View video details, tags, and notes in your Pocketed library.",
  });

  return (
    <main className="container mx-auto max-w-7xl px-4 pt-8 md:px-8">
      <h1 className="font-serif text-4xl font-bold">Video Detail</h1>
    </main>
  );
}
