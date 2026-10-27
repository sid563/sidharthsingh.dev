"use client";

import * as React from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wraps every fenced code block from MDX: a language label and a copy button
 * float over the top-right corner. The `pre` itself is whatever shiki
 * produced, so highlighting stays build-time and theme switching is CSS.
 */
export function CodeBlock({ className, children, ...props }: React.ComponentProps<"pre">) {
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);
  const language = (props as Record<string, unknown>)["data-language"];
  const label = typeof language === "string" && language !== "text" && language !== "plaintext" ? language : null;

  const copy = async () => {
    const text = ref.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context); fail quietly.
    }
  };

  return (
    <div className="code-block group/code">
      <pre ref={ref} className={cn(className)} {...props}>
        {children}
      </pre>
      <div className="code-block-tools">
        {label ? <span className="code-block-lang">{label}</span> : null}
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          data-copied={copied || undefined}
          className="code-block-copy"
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          <span className="sr-only" aria-live="polite">
            {copied ? "Copied" : ""}
          </span>
        </button>
      </div>
    </div>
  );
}
