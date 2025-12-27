import { Loader2 } from "lucide-react";

export default function SettingsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    </div>
  );
}
