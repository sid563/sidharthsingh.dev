import { cn } from "@/lib/utils";

/**
 * The one page column. Header, footer and every page share this width so the
 * left edge never moves between routes. Long-form text limits its own measure
 * inside the column (e.g. `max-w-3xl` on an article) instead of centring a
 * narrower box.
 */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-6", className)} {...props} />;
}
