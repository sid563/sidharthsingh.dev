import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionProps = React.ComponentProps<"section"> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Optional "view all" link shown on the right of the heading. */
  href?: string;
  hrefLabel?: string;
};

export function Section({
  eyebrow,
  title,
  description,
  href,
  hrefLabel = "View all",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("py-12 sm:py-16", className)} {...props}>
      {title ? (
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            {eyebrow ? (
              <p className="mb-2 font-mono text-xs tracking-wider text-brand uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
            {description ? (
              <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {href ? (
            <Link
              href={href}
              className="group inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {hrefLabel}
              <ArrowUpRightIcon className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
