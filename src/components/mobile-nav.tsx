"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site } from "@/data/site";

type Item = { label: string; href: string };

export function MobileNav({ items }: { items: readonly Item[] }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />}
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>{site.name}</SheetTitle>
          <SheetDescription>{site.role}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col px-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b py-3 text-lg font-medium last:border-b-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-wrap gap-4 p-4 text-sm text-muted-foreground">
          {site.socials.map((s) => (
            <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className="hover:text-foreground">
              {s.label}
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
