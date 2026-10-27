/**
 * A hairline under the header that fills as the reader scrolls. Pure CSS:
 * a scroll-driven animation (see .reading-progress in globals.css). Browsers
 * without animation-timeline simply never show it.
 */
export function ReadingProgress() {
  return <div className="reading-progress" aria-hidden />;
}
