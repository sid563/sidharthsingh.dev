"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Item = { label: string; href: string };

export function NavLinks({
  items,
  className,
}: {
  items: readonly Item[];
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={cn("items-center gap-1", className)}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {item.label}
            {active ? (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-3 -bottom-[13px] h-px bg-foreground"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
