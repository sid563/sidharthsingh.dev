import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { InfoIcon, LightbulbIcon, TriangleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/mdx/code-block";
import { Diagram } from "@/components/mdx/diagram";
import { Figure } from "@/components/mdx/figure";

type CalloutProps = {
  type?: "note" | "tip" | "warning";
  title?: string;
  children: React.ReactNode;
};

const calloutStyles = {
  note: { icon: InfoIcon, className: "border-info/30 bg-info-soft text-foreground" },
  tip: { icon: LightbulbIcon, className: "border-brand/30 bg-brand-soft text-foreground" },
  warning: { icon: TriangleAlertIcon, className: "border-warning/40 bg-warning-soft text-foreground" },
};

export function Callout({ type = "note", title, children }: CalloutProps) {
  const { icon: Icon, className } = calloutStyles[type];
  return (
    <aside className={cn("not-prose my-6 flex gap-3 rounded-xl border p-4 text-sm", className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="space-y-1">
        {title ? <p className="font-medium">{title}</p> : null}
        <div className="text-muted-foreground [&_a]:underline [&_a]:underline-offset-3">{children}</div>
      </div>
    </aside>
  );
}

/**
 * Components available inside every MDX file.
 * - Internal links use next/link; external ones open in a new tab.
 * - `pre` is wrapped so every code block gets a copy button and language label.
 * - <Callout>, <Figure> and <Diagram> are the article building blocks.
 */
export const mdxComponents: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  },
  pre: CodeBlock,
  Callout,
  Figure,
  Diagram,
};
