"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useThemeTransition } from "@/lib/use-theme-transition";
import {
  FileTextIcon,
  FolderGitIcon,
  GaugeIcon,
  ExternalLinkIcon,
  MailIcon,
  MapIcon,
  SearchIcon,
  SunMoonIcon,
  UserIcon,
  FileBadgeIcon,
  KeyboardIcon,
} from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { OPEN_COMMAND_MENU, OPEN_SHORTCUTS, shortcutFor } from "@/lib/shortcuts";

export type CommandGroupName = "Pages" | "Projects" | "Writing" | "Progress";
export type CommandEntry = { label: string; href: string; group: CommandGroupName; hint?: string };

const groupIcons: Record<CommandGroupName, React.ComponentType<{ className?: string }>> = {
  Pages: FileTextIcon,
  Projects: FolderGitIcon,
  Writing: FileTextIcon,
  Progress: GaugeIcon,
};

const pageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/projects": FolderGitIcon,
  "/writing": FileTextIcon,
  "/roadmap": MapIcon,
  "/progress": GaugeIcon,
  "/about": UserIcon,
  "/resume": FileBadgeIcon,
};

/**
 * Global ⌘K palette. Entries are computed on the server (site header) and
 * passed in, so this stays a thin client component.
 */
export function CommandMenu({ entries }: { entries: CommandEntry[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { toggleTheme } = useThemeTransition();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_MENU, onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_MENU, onOpen);
    };
  }, []);

  const run = React.useCallback((fn: () => void) => {
    setOpen(false);
    fn();
  }, []);

  const groups: CommandGroupName[] = ["Pages", "Projects", "Writing", "Progress"];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <SearchIcon />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Jump to a page, project or post"
        className="sm:max-w-lg"
      >
        <Command>
          <CommandInput placeholder="Type to search…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            {groups.map((group) => {
              const items = entries.filter((e) => e.group === group);
              if (items.length === 0) return null;
              const Icon = groupIcons[group];
              return (
                <CommandGroup key={group} heading={group}>
                  {items.map((item) => {
                    const ItemIcon = pageIcons[item.href] ?? Icon;
                    return (
                      <CommandItem
                        key={item.href}
                        value={`${group} ${item.label} ${item.hint ?? ""}`}
                        onSelect={() => run(() => router.push(item.href))}
                      >
                        <ItemIcon />
                        <span className="truncate">{item.label}</span>
                        {item.hint ? (
                          <span className="ml-2 truncate text-xs text-muted-foreground">{item.hint}</span>
                        ) : null}
                        {group === "Pages" && shortcutFor(item.href) ? (
                          <CommandShortcut>{shortcutFor(item.href)}</CommandShortcut>
                        ) : null}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
            <CommandGroup heading="Actions">
              <CommandItem
                value="toggle theme dark light"
                onSelect={() => run(() => toggleTheme())}
              >
                <SunMoonIcon />
                Toggle theme
                <CommandShortcut>T</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="keyboard shortcuts help"
                onSelect={() => run(() => window.dispatchEvent(new Event(OPEN_SHORTCUTS)))}
              >
                <KeyboardIcon />
                Keyboard shortcuts
                <CommandShortcut>?</CommandShortcut>
              </CommandItem>
              <CommandItem value="github" onSelect={() => run(() => window.open(site.github, "_blank"))}>
                <ExternalLinkIcon />
                Open GitHub
              </CommandItem>
              <CommandItem
                value="email copy"
                onSelect={() => run(() => void navigator.clipboard.writeText(site.email))}
              >
                <MailIcon />
                Copy email address
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
