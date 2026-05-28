// Minimal classNames joiner — avoids pulling in clsx for a one-liner.
// Mirrors marketing's @/lib/cn so moved primitives have no app-alias imports.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
