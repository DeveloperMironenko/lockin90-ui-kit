/** Tiny classNames joiner (no dependency). Accepts strings, arrays, and
 *  `{ 'class': boolean }` maps; ignores falsy values. */
export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string' || typeof input === 'number') {
      out.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) out.push(inner);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) out.push(key);
      }
    }
  }
  return out.join(' ');
}
