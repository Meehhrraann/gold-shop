"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions during SSR
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        className="border border-black"
      >
        <div className="h-4 w-4" /> {/* Empty placeholder */}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={`cursor-pointer border-none bg-transparent ${theme === "dark" ? "text-white" : "text-black"}`}
    >
      {theme === "dark" ? (
        <Sun className="size-7 rounded-lg border-2 border-white p-1 text-white" />
      ) : (
        <Moon className="size-7 rounded-lg border-2 border-black p-1 text-black" />
      )}
    </Button>
  );
}
