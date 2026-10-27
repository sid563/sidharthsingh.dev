import { ViewTransition } from "react";

/**
 * Remounts on every navigation, which makes it the one place to give each
 * page an entrance. React's <ViewTransition> drives the browser's View
 * Transitions API; the classes map to keyframes in globals.css. Browsers
 * without the API, and reduced-motion users, simply swap content.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
