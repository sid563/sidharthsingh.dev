"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useThemeTransition } from "@/lib/use-theme-transition";
import { actionShortcuts, gotoShortcuts, OPEN_COMMAND_MENU, OPEN_SHORTCUTS } from "@/lib/shortcuts";

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Global single-key shortcuts, mounted once in the root layout.
 * Nothing fires while typing in a field or when a modifier is held, so the
 * browser's own shortcuts are untouched.
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const { toggleTheme } = useThemeTransition();
  const [open, setOpen] = React.useState(false);
  const pending = React.useRef<number | null>(null);

  React.useEffect(() => {
    const clearPending = () => {
      if (pending.current) window.clearTimeout(pending.current);
      pending.current = null;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      // Inside an open dialog (palette, sheet, this list) only Escape matters.
      if (document.querySelector("[role=dialog][data-open], [role=dialog][open]")) return;

      const key = event.key;
      if (pending.current) {
        clearPending();
        const target = gotoShortcuts.find((s) => s.keys === `g ${key.toLowerCase()}`);
        if (target) {
          event.preventDefault();
          router.push(target.href);
        }
        return;
      }
      switch (key) {
        case "g":
          pending.current = window.setTimeout(clearPending, 1200);
          return;
        case "t":
          event.preventDefault();
          toggleTheme();
          return;
        case "/":
          event.preventDefault();
          window.dispatchEvent(new Event(OPEN_COMMAND_MENU));
          return;
        case "?":
          event.preventDefault();
          setOpen(true);
          return;
      }
    };
    const onOpenRequest = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_SHORTCUTS, onOpenRequest);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_SHORTCUTS, onOpenRequest);
      clearPending();
    };
  }, [router, toggleTheme]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>Vim-style: press g, then a letter.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 sm:grid-cols-2">
          <ShortcutList title="Go to" items={gotoShortcuts} />
          <ShortcutList title="Actions" items={actionShortcuts} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShortcutList({ title, items }: { title: string; items: readonly { keys: string; label: string }[] }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">{title}</p>
      <dl className="space-y-1.5 text-sm">
        {items.map((item) => (
          <div key={`${item.keys}-${item.label}`} className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="flex gap-1">
              {item.keys.split(" ").map((k, i) => (
                <kbd
                  key={i}
                  className="inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1.5 font-mono text-[11px] text-foreground"
                >
                  {k}
                </kbd>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
