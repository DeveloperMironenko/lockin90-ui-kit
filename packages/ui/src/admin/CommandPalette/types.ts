export interface CommandItem {
  id: string;
  label: string;
  group: string;
  href?: string;
  onRun?: () => void;
  hint?: string;
}
