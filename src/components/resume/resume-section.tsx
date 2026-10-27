import { cn } from "@/lib/utils";

/** Section label on the left, content on the right; stacks on mobile. */
export function ResumeSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "resume-section grid gap-4 border-t py-8 sm:grid-cols-[9rem_1fr] sm:gap-8 print:py-4",
        className,
      )}
    >
      <h2 className="font-mono text-xs tracking-wider text-brand uppercase sm:pt-1">{title}</h2>
      <div className="min-w-0 space-y-8 print:space-y-5">{children}</div>
    </section>
  );
}

/** One dated entry: meta (dates, place) on the left, heading and body on the right. */
export function ResumeEntry({
  meta,
  heading,
  subheading,
  children,
}: {
  meta: React.ReactNode;
  heading: React.ReactNode;
  subheading?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <article className="resume-entry grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
      <div className="text-sm text-muted-foreground tabular-nums">{meta}</div>
      <div className="min-w-0">
        <h3 className="font-medium leading-snug">{heading}</h3>
        {subheading ? <p className="text-sm text-muted-foreground">{subheading}</p> : null}
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
    </article>
  );
}

export function Chips({ items, className }: { items: readonly string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border px-1.5 py-0.5 font-mono text-[11px] leading-4 text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
