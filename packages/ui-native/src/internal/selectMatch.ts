/** Search a Select's options (U5): the query matches the option's label or its value, case-insensitive,
 *  with underscores read as spaces and each "/" part on its own, so "new york" finds the IANA id
 *  `America/New_York` and "kyiv" finds `Europe/Kyiv` whatever the label. The native twin is identical. */
export function optionMatches(option: { label: string; value: string }, query: string): boolean {
  const norm = (t: string) => t.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
  const q = norm(query);
  if (!q) return true;
  const hay = [option.label, option.value, ...option.value.split('/')].map(norm);
  return hay.some((h) => h.includes(q));
}
