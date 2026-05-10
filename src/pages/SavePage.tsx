import { useSearchParams } from "react-router-dom";

export default function SavePage() {
  const [searchParams] = useSearchParams();
  const urlToSave = searchParams.get("url") || "";

  return (
    <div className="save-page p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Save to Pocketed</h1>
      {urlToSave ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">Preparing to save URL:</p>
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
