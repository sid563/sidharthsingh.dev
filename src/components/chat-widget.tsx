"use client";

import * as React from "react";
import { MessageSquareTextIcon, SendHorizontalIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMarkdown } from "@/components/chat-markdown";
import { site } from "@/data/site";
import { ChatError, streamAnswer, type ChatTurn } from "@/lib/chat-api";
import { cn } from "@/lib/utils";

type Message = ChatTurn & { id: number; sources?: string[]; error?: string; pending?: boolean };

const STORAGE_KEY = "chat-widget:v1";
const MAX_CHARS = 500;
const suggestions = [
  "What did Sidharth build at 1buy.ai?",
  "How does the Postgres job queue work?",
  "What is his Rust experience?",
  "How do I contact him?",
];

/**
 * Floating "ask about me" panel. Streams answers from the personal-rag API
 * (see src/lib/chat-api.ts); the conversation survives navigation through
 * sessionStorage and ends when the tab closes.
 */
export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const nextId = React.useRef(1);

  const restored = React.useRef(false);

  /** Bring back this tab's earlier conversation the first time the panel opens. */
  const restore = () => {
    if (restored.current) return;
    restored.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = (JSON.parse(raw) as Message[]).filter((m) => !m.pending);
      if (Array.isArray(saved) && saved.length) {
        setMessages(saved);
        nextId.current = Math.max(...saved.map((m) => m.id)) + 1;
      }
    } catch {
      // storage unavailable: the chat simply starts empty
    }
  };

  // Save after every change. Only `clear` removes the entry: a fresh page load
  // starts with an empty list and must not wipe the conversation it is about to restore.
  React.useEffect(() => {
    if (!messages.length) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Close on Escape or on a click outside; focus the input when opening.
  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
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

  // Keep the newest message in view.
  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  const update = (id: number, patch: Partial<Message> | ((m: Message) => Partial<Message>)) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...(typeof patch === "function" ? patch(m) : patch) } : m)));

  const ask = async (text: string) => {
    const question = text.trim().slice(0, MAX_CHARS);
    if (!question || busy) return;
    const history: ChatTurn[] = messages
      .filter((m) => !m.error && m.content)
      .slice(-6)
      .map(({ role, content }) => ({ role, content }));
    const userId = nextId.current++;
    const answerId = nextId.current++;
    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: question },
      { id: answerId, role: "assistant", content: "", pending: true },
    ]);
    setInput("");
    setBusy(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      await streamAnswer({
        message: question,
        history,
        signal: controller.signal,
        onSources: (sources) => update(answerId, { sources }),
        onToken: (t) => update(answerId, (m) => ({ content: m.content + t })),
      });
      update(answerId, { pending: false });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const message = err instanceof ChatError ? err.message : "Something went wrong. Please try again.";
      update(answerId, (m) => ({ pending: false, error: m.content ? undefined : message, content: m.content }));
    } finally {
      setBusy(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  };

  const clear = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    inputRef.current?.focus();
  };

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3 print:hidden sm:right-6 sm:bottom-6">
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby="chat-widget-title"
          className="flex w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-[0_24px_60px_-24px_rgb(0_0_0/0.35)] dark:shadow-[0_24px_60px_-24px_rgb(0_0_0/0.9)]"
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
                <p className="text-[11px] text-muted-foreground" aria-live="polite">
                  {busy ? "Thinking…" : "Answers from this site's content"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length ? (
                <Button variant="ghost" size="xs" onClick={clear}>
                  Clear
                </Button>
              ) : null}
              <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setOpen(false)}>
                <XIcon />
              </Button>
            </div>
          </div>

          <div ref={listRef} className="max-h-[min(60vh,28rem)] space-y-3 overflow-y-auto px-4 py-4 text-sm" aria-live="polite">
            {messages.length === 0 ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  Ask about my work, projects, stack or background. Answers come from the pages on this site.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-full border bg-muted/40 px-2.5 py-1 text-[12px] text-foreground/80 transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[88%] rounded-2xl px-3 py-2 leading-relaxed",
                      m.role === "user" ? "rounded-br-sm bg-foreground text-background" : "rounded-bl-sm bg-muted/60",
                      m.error && "border border-destructive/30 bg-destructive/5 text-foreground",
                    )}
                  >
                    {m.role === "user" ? (
                      <span className="whitespace-pre-wrap">{m.content}</span>
                    ) : m.error ? (
                      <span>{m.error}</span>
                    ) : m.pending && !m.content ? (
                      <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                      </span>
                    ) : (
                      <ChatMarkdown text={m.content} />
                    )}
                    {m.role === "assistant" && !m.pending && !m.error && m.sources?.length ? (
                      <p className="mt-1.5 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                        from {m.sources.join(" · ").replace(/-/g, " ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t px-3 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              void ask(input);
            }}
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Ask about my work…"
              aria-label="Your question"
              autoComplete="off"
              maxLength={MAX_CHARS}
              disabled={busy}
              className="h-9 rounded-xl"
            />
            <Button type="submit" size="icon" aria-label="Send" disabled={busy || !input.trim()} className="rounded-xl">
              <SendHorizontalIcon />
            </Button>
          </form>
          <p className="border-t bg-muted/30 px-4 py-1.5 text-[10px] text-muted-foreground">
            It can be wrong. For anything important,{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-2">
              email me
            </a>
            .
          </p>
        </div>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        aria-label={open ? "Close chat" : "Ask about me"}
        aria-expanded={open}
        onClick={() => {
          restore();
          setOpen((o) => !o);
        }}
        className={cn(
          "group relative grid size-12 place-items-center rounded-full bg-foreground text-background shadow-[0_12px_32px_-12px_rgb(0_0_0/0.45)] transition-transform duration-200 hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-95",
        )}
      >
        {open ? <XIcon className="size-5" /> : <MessageSquareTextIcon className="size-5" />}
      </button>
    </div>
  );
}
