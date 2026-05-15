import { useSearchParams } from "react-router-dom";
import { useMeta } from "@/hooks/useMeta";
import { useTitle } from "@/hooks/useTitle";

export default function SavePage() {
  useTitle("Save");
  useMeta({ description: "Save a new video to your Pocketed library." });
  const [searchParams] = useSearchParams();

  const urlToSave = searchParams.get("url") || "";

  return (
    <div className="save-page p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">
        Save to Pocketed
      </h1>
      {urlToSave ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Preparing to save URL:
          </p>
          <input
            type="url"
            value={urlToSave}
            readOnly
            className="w-full p-3 border rounded-md bg-muted text-foreground"
          />
          {/* Automatic save flow kicking off here */}
        </div>
      ) : (
        <p className="text-muted-foreground">No URL provided.</p>
      )}
    </div>
  );
}
