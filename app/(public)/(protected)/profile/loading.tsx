import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="text-primary flex min-h-screen justify-center p-8">
      <div dir="rtl" className="flex gap-2 pt-36">
        <Loader2 className="size-6 animate-spin" />
        <p className="text-muted-foreground">لطفا منتظر بمانید...</p>
      </div>
    </div>
  );
}
