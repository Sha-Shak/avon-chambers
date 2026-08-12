"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Renders nothing until mounted so the icon always matches the theme
 * next-themes actually resolved on the client — rendering a guess during
 * SSR would flash the wrong icon before hydration settles.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn("shrink-0 text-foreground", className)}
    >
      {mounted && resolvedTheme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
