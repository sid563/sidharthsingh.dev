/**
 * Client for the personal-rag chat API (github.com/sid563/personal-rag).
 * Safe to import from client components: no server-only dependencies.
 */
export const chatApiUrl = (process.env.NEXT_PUBLIC_CHAT_API_URL ?? "https://chat.sidharthsingh.dev").replace(
  /\/$/,
  "",
);

export type ChatTurn = { role: "user" | "assistant"; content: string };

export class ChatError extends Error {
  constructor(
    message: string,
    public readonly retryAfter?: number,
  ) {
    super(message);
    this.name = "ChatError";
  }
}

type StreamEvent =
  | { type: "sources"; sources: string[] }
  | { type: "token"; text: string }
  | { type: "done"; provider: string }
  | { type: "error"; message: string };

const unreachable = "I can't reach the assistant right now. Please try again in a minute, or email me instead.";

/**
 * POST /api/chat/stream and feed the server-sent events to the callbacks.
 * Resolves when the answer is complete; rejects with ChatError on any failure.
 */
export async function streamAnswer(opts: {
  message: string;
  history: ChatTurn[];
  signal: AbortSignal;
  onSources: (sources: string[]) => void;
  onToken: (text: string) => void;
}): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${chatApiUrl}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: opts.message, history: opts.history }),
      signal: opts.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ChatError(unreachable);
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[]; retryAfter?: number } | null;
    const message = Array.isArray(body?.message) ? body?.message.join(", ") : body?.message;
    throw new ChatError(message || (res.status === 429 ? "Too many questions right now. Give it a moment." : unreachable), body?.retryAfter);
  }
  if (!res.body) throw new ChatError(unreachable);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line.startsWith("data:")) continue;
      let event: StreamEvent;
      try {
        event = JSON.parse(line.slice(5).trim()) as StreamEvent;
      } catch {
        continue;
      }
      if (event.type === "sources") opts.onSources(event.sources);
      else if (event.type === "token") opts.onToken(event.text);
      else if (event.type === "error") throw new ChatError(event.message || unreachable);
      else if (event.type === "done") return;
    }
  }
}
