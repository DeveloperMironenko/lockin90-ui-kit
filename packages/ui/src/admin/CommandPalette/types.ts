/** A single entry in the admin ⌘K command palette. */
export interface CommandItem {
  id: string;
  label: string;
  group: string;
  /** Navigation target — when set, selecting the item routes here. */
  href?: string;
  /** Imperative action — runs when the item has no `href`. */
  onRun?: () => void;
  hint?: string;
}

export interface CommandPaletteProps {
  /**
   * Command set to render. Omit to use the built-in admin navigation list
   * (`DEFAULT_COMMANDS`) — the original prop-less behavior.
   */
  commands?: CommandItem[];
  /** Controlled open state. Omit for the built-in ⌘K / Ctrl-K self-toggle. */
  open?: boolean;
  /** Fired when the palette wants to open/close (controlled or uncontrolled). */
  onOpenChange?: (open: boolean) => void;
  /** Fired when an item is chosen — runs before the item's `href`/`onRun`. */
  onSelect?: (item: CommandItem) => void;
  /** Search-input placeholder. */
  placeholder?: string;
  className?: string;
}
