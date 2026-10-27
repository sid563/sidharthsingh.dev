/** Dates in content are ISO strings (YYYY-MM-DD or YYYY-MM). Format in UTC so
 *  the rendered day never shifts with the build machine's timezone. */
export function formatDate(
  input: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
) {
  const date = typeof input === "string" ? new Date(input) : input;
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(
    date,
  );
}

export function formatMonth(input: string | Date) {
  return formatDate(input, { year: "numeric", month: "short" });
}

/** "Mar 2026 – Present" style ranges for resume and timelines. */
export function formatRange(start: string, end: string | null) {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}
