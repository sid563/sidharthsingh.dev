/**
 * Keyboard shortcuts shared by the global listener, the ? dialog and the
 * command palette. "g" starts a two-key sequence, vim style.
 */
export const gotoShortcuts = [
  { keys: "g h", href: "/", label: "Home" },
  { keys: "g w", href: "/projects", label: "Work" },
  { keys: "g b", href: "/writing", label: "Writing" },
  { keys: "g r", href: "/roadmap", label: "Roadmap" },
  { keys: "g p", href: "/progress", label: "Progress" },
  { keys: "g a", href: "/about", label: "About" },
  { keys: "g n", href: "/now", label: "Now" },
  { keys: "g c", href: "/contact", label: "Contact" },
] as const;

export const actionShortcuts = [
  { keys: "⌘ K", label: "Search" },
  { keys: "/", label: "Search" },
  { keys: "t", label: "Toggle theme" },
  { keys: "?", label: "This list" },
  { keys: "Esc", label: "Close" },
] as const;

export const shortcutFor = (href: string) => gotoShortcuts.find((s) => s.href === href)?.keys ?? null;

/** Custom events let the listener talk to the palette without shared state. */
export const OPEN_COMMAND_MENU = "site:open-command-menu";
export const OPEN_SHORTCUTS = "site:open-shortcuts";
