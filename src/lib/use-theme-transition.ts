"use client";

import * as React from "react";
import { useTheme } from "next-themes";

/**
 * Theme switching with a circular reveal, using the View Transitions API
 * (see ::view-transition-new(root) in globals.css). The reveal grows from
 * `origin`, normally the toggle button. Browsers without the API and users
 * who prefer reduced motion get an instant switch, which is the same thing
 * next-themes did before.
 */
export function useThemeTransition() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = React.useCallback(
    (origin?: { x: number; y: number }) => {
      const next = resolvedTheme === "dark" ? "light" : "dark";
      const root = document.documentElement;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (typeof document.startViewTransition !== "function" || reduce) {
        setTheme(next);
        return;
      }

      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      root.style.setProperty("--vt-x", `${x}px`);
      root.style.setProperty("--vt-y", `${y}px`);
      root.style.setProperty("--vt-r", `${radius}px`);
      root.dataset.themeTransition = "";

      const transition = document.startViewTransition(() => {
        // Apply the class synchronously inside the callback so the "new"
        // snapshot is already in the next theme; next-themes then persists
        // the choice and re-applies the same class a tick later.
        root.classList.toggle("dark", next === "dark");
        root.style.colorScheme = next;
        setTheme(next);
      });
      transition.finished.finally(() => {
        delete root.dataset.themeTransition;
      });
    },
    [resolvedTheme, setTheme],
  );

  return { resolvedTheme, toggleTheme };
}
