"use client";

import * as React from "react";

/**
 * Wall-clock time in a fixed zone, refreshed every minute. The server renders
 * a neutral placeholder of the same width so nothing shifts on hydration.
 */
export function LocalTime({ timeZone = "Asia/Kolkata", label = "IST" }: { timeZone?: string; label?: string }) {
  const [time, setTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const toNextMinute = 60_000 - (Date.now() % 60_000);
    let interval = 0;
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, toNextMinute);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [timeZone]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {time ?? "··:··"} {label}
    </span>
  );
}
