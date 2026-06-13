/** Friendly day label + short date for an entry row, e.g. { label:'Today', sub:'Jun 13' }. */
export function formatEntryDate(dateStr: string): { label: string; sub: string } {
  const d = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mons = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const isToday = d.toDateString() === today.toDateString();
  const isYesterday = d.toDateString() === yesterday.toDateString();
  const label = isToday ? 'Today' : isYesterday ? 'Yesterday' : dows[d.getDay()];
  const sub = `${mons[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
  return { label, sub };
}
