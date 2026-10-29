import * as React from "react";

/**
 * Renders the small markdown subset the assistant is allowed to use:
 * paragraphs, bullet and numbered lists, **bold**, and bare links.
 * Handles partial text while an answer is still streaming.
 */
export function ChatMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).filter((b) => b.trim().length > 0);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        const bullet = /^\s*[-*•]\s+/;
        const numbered = /^\s*\d+[.)]\s+/;
        if (lines.length > 0 && lines.every((l) => bullet.test(l))) {
          return (
            <ul key={i} className="my-1.5 list-disc space-y-1 pl-4">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(bullet, ""))}</li>
              ))}
            </ul>
          );
        }
        if (lines.length > 0 && lines.every((l) => numbered.test(l))) {
          return (
            <ol key={i} className="my-1.5 list-decimal space-y-1 pl-4">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(numbered, ""))}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={i} className="my-1.5 first:mt-0 last:mb-0">
            {lines.map((l, j) => (
              <React.Fragment key={j}>
                {j > 0 ? <br /> : null}
                {inline(l.replace(/^#+\s*/, ""))}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

const token = /(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g;

function inline(text: string): React.ReactNode[] {
  return text.split(token).map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (/^https?:\/\//.test(part)) {
      const trimmed = part.replace(/[.,;:]+$/, "");
      const tail = part.slice(trimmed.length);
      return (
        <React.Fragment key={i}>
          <a href={trimmed} className="text-brand underline underline-offset-2" target="_blank" rel="noreferrer">
            {trimmed.replace(/^https?:\/\//, "")}
          </a>
          {tail}
        </React.Fragment>
      );
    }
    return part;
  });
}
