"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeTransition } from "@/lib/use-theme-transition";
import { cn } from "@/lib/utils";

/**
 * Light/dark switch. Both icons are rendered and CSS picks the visible one,
 * so there is no hydration mismatch and no "mounted" state dance. Clicking
 * reveals the new theme in a circle growing out of the button.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { toggleTheme } = useThemeTransition();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("theme-toggle relative", className)}
      aria-label="Toggle theme"
      onClick={() => {
        const rect = ref.current?.getBoundingClientRect();
        toggleTheme(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined);
      }}
    >
      <SunIcon className="theme-icon theme-icon-sun" />
      <MoonIcon className="theme-icon theme-icon-moon" />
    </Button>
  );
}
