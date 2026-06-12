// Minimal classNames joiner — avoids pulling in clsx for a one-liner.
// Internal util (not exported from the package barrel).
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
