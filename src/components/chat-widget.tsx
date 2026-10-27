"use client";

import * as React from "react";
import Link from "next/link";
import { MessageSquareTextIcon, SendHorizontalIcon, SparklesIcon, XIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Floating "ask me anything" entry point. For now it opens a coming-soon card.
 *
 * Next week: replace the card body with the real chat UI and point it at an
 * API route (for example /api/chat) that answers from the content files.
 */
export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || buttonRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 print:hidden sm:right-6 sm:bottom-6">
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby="chat-widget-title"
          className="w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-[0_24px_60px_-24px_rgb(0_0_0/0.35)] dark:shadow-[0_24px_60px_-24px_rgb(0_0_0/0.9)]"
        >
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-foreground font-mono text-[11px] text-background">
                SS
              </span>
              <div className="leading-tight">
                <p id="chat-widget-title" className="text-sm font-medium">
                  Ask about {site.firstName}
                </p>
                <p className="text-[11px] text-muted-foreground">Chatbot · coming soon</p>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setOpen(false)}>
              <XIcon />
            </Button>
          </div>

          <div className="space-y-4 px-4 py-4 text-sm">
            <div className="flex gap-2.5">
              <SparklesIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <p className="text-muted-foreground">
                A chatbot that knows my work, resume, roadmap and progress is landing here next
                week. It will answer from the same files that power this site.
              </p>
            </div>

            <div
              aria-disabled
              className="flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-2 text-muted-foreground"
            >
              <span className="flex-1 truncate text-sm">Ask about my Rust or Postgres work…</span>
              <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[10px] tracking-wider text-brand uppercase">
                Soon
              </span>
              <SendHorizontalIcon className="size-4 opacity-40" aria-hidden />
            </div>

            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${site.email}`} className={buttonVariants({ size: "sm" })}>
                Email me instead
              </a>
              <Link href="/roadmap" className={buttonVariants({ size: "sm", variant: "outline" })}>
                See the roadmap
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close chat" : "Ask about me (chatbot coming soon)"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "group relative grid size-12 place-items-center rounded-full bg-foreground text-background shadow-[0_12px_32px_-12px_rgb(0_0_0/0.45)] transition-transform duration-200 hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-95",
        )}
      >
        {open ? <XIcon className="size-5" /> : <MessageSquareTextIcon className="size-5" />}
        {!open ? (
          <span className="absolute -top-1.5 -right-1.5 rounded-full border-2 border-background bg-brand px-1.5 py-px font-mono text-[9px] font-medium tracking-wider text-brand-foreground uppercase">
            Soon
          </span>
        ) : null}
      </button>
    </div>
  );
}
